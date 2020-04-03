import AsyncStorage from '@react-native-community/async-storage';

let PREFIX = null;

export const setPrefix = prefix => {
  PREFIX = prefix && prefix.toLowerCase() || null;
};

const getStorageKey = key => {
  validatePrefix();
  let myKey = PREFIX + ':' + key.toLowerCase();
  return myKey;
};

export const validatePrefix = () => {
  if (!PREFIX || PREFIX === '') throw new Error('Missing prefix for storage');
};

export const getData = key => {
  return new Promise((resolve, reject) => {
    try {
      const value = AsyncStorage.getItem(getStorageKey(key), (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(result) || null);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const setData = (key, data) => {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.setItem(getStorageKey(key), JSON.stringify(data), err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const removeData = key => {
  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.removeItem(getStorageKey, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const removeDataWithPrefix = async prefix => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('All keys: ', allKeys);
    allKeys.forEach(key => {
      if (key.toLowerCase().indexOf(prefix.toLowerCase()) > -1) {
        AsyncStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.log('failed to remove data with prefix: ' + prefix, err.message);
  }
}

export default { removeData, setData, getData, setPrefix, removeDataWithPrefix };
