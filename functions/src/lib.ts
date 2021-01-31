import {names, prefix} from "./usernames";


const randomElement = (array: Array<any>) => {
  return array[Math.floor(Math.random() * array.length)];
};


const generateUsername = () => {
  const username: string = randomElement(prefix) + randomElement(names);
  return username;
};

const generateId = (length: number) => {
  const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const seq = Math.floor(Math.random() * charset.length);
    result += charset[seq];
  }
  return result;
};

export {generateUsername, generateId};
