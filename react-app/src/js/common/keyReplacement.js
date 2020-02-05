export default function replaceKeys(object, replacements) {
  let replacedParameters = Object.keys(object).map((key) => {
    const newKey = replacements[key] || key;
    return { [newKey]: object[key] };
  });
  return replacedParameters.reduce((a, b) => Object.assign({}, a, b));
}
