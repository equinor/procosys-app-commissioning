import ApiService from './api';
import NavigationService from './NavigationService';

/**
 * Handle deep linking URL's
 */

 const SUPPORTED_URL_TYPES = {
   COMMPKG: "commpkg"
 }

 const SUPPORTED_URL_VERSION = {
   V1: "v1"
 }


 /**
  * Handles sanitizing URL and executing the correct router for each version. 
  * @public
  * @param {String} url URL in the form of "commapp://<version>:<intent>:<data>"
  * 
  */
const handleUrl = (url) => {
  if (!url || url === "") throw "Missing parameter";

  //Remove Schema: 
  const urlWithoutSchema = url.substring("commapp://".length,url.length);
  const urlWithoutTrailingSlash = url[url.length-1] === "/" ? urlWithoutSchema.substring(0,urlWithoutSchema.length-1) : urlWithoutSchema;

  const [version] = urlWithoutTrailingSlash.split(":",1);

  switch (version.toLowerCase()) {
    case SUPPORTED_URL_VERSION.V1:
      handleUrlFor_V1(urlWithoutTrailingSlash);
      break;
    default: 
    throw "Unsupported URL version";
  }
}

/**
 * Performs UI Navigation based on supported URL Schema
 * 
 * @param {String} pUrl URL Without Schema and Trailing slashes
 * 
 * 
 */
const handleUrlFor_V1 = (pUrl) => {
  if (!pUrl || pUrl === "") throw "Missing parameter";
  const [version, urlType, urlParam] = pUrl.split(":");
  if (version.toLowerCase() != SUPPORTED_URL_VERSION.V1) throw "Wrong handler accessed for V1 URL";
  switch (urlType.toLowerCase()) {
    case SUPPORTED_URL_TYPES.TAGSCOPE:
      navigateToTagScope(urlParam);
      break;
    default: 
      throw "Unsupported URL format";
    }
}

const navigateToTagScope = async (tagNo) => {
  let result = [];
  try {
    let apiResult = await ApiService.searchForTag(tagNo);
    result = apiResult.Items;
  } catch (err) {
    throw err;
  }

  if (result.length > 1) throw `Multiple tags located for ${tagNo}, please use a more specific url`;
  if (result.length <= 0) throw `No tags found for ${tagNo}`;

  // {Description, Id, TagNo}
  const item = {Description, Id, TagNo} = result[0];

  NavigationService.navigate('TagRoute', { item: item });
}


export default {
  handleUrl,
}
