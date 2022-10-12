import {SKIP_NON_OBJECT_BODY_PART} from "./constants.js";

const checkAndSkipNonObjectPart = (isSkipRequired, logs) => {
    let currentCharIndex = 0;
    let output = "";
    if (isSkipRequired) {
        currentCharIndex = getObjectBodyStartIndex(logs);
        if (currentCharIndex > 0) {
            output = logs.substring(0, currentCharIndex) + "\n";
        }
    }
    return [output, currentCharIndex];
};

const getTabs = (count) => {
    let result = "";
    while (count--) {
        result += "    ";
    }
    return result;
};

const getObjectBodyStartIndex = (logs) => {
    const PARAMS_STR = "with params";
    const RESULT_STR = "with result";
    let paramsIndex = logs.indexOf(PARAMS_STR);
    paramsIndex = paramsIndex < 0 ? Number.POSITIVE_INFINITY : paramsIndex + PARAMS_STR.length;
    let resultIndex = logs.indexOf(RESULT_STR);
    resultIndex = resultIndex < 0 ? Number.POSITIVE_INFINITY : resultIndex + RESULT_STR.length;
    let result = Math.min(paramsIndex, resultIndex);
    if (result === Number.POSITIVE_INFINITY) {
        return 0;
    }
    if (logs[result] === ":") {
        result++;
    }
    return result;
};

export const createOnClick = (inputElement, outputElement, parameterElementsMap) => {
    return () => {
        let logs = inputElement.value;
        if (!logs) {
            return;
        }
        let isSkippingNonObjectBodyPart = parameterElementsMap.get(SKIP_NON_OBJECT_BODY_PART).getCheckbox().checked;
        let [output, currentCharIndex] = checkAndSkipNonObjectPart(isSkippingNonObjectBodyPart, logs);
        let tabsCount = 0;
        let tabs = "";
        let isValue = false;
        let isInSentence = false;
        for (currentCharIndex; currentCharIndex < logs.length; currentCharIndex++) {
            let currentChar = logs[currentCharIndex];
            switch (currentChar) {
                case "[":
                case "{":
                    isValue = false;
                    isInSentence = false;
                    tabs = getTabs(++tabsCount);
                    output += currentChar + "\n" + tabs;
                    break;
                case "]":
                case "}":
                    isValue = false;
                    isInSentence = false;
                    tabs = getTabs(--tabsCount);
                    output += "\n" + tabs + currentChar;
                    let isLastOnLine = true;
                    for (let i = currentCharIndex + 1; i < logs.length; i++) {
                        if (["\t", " ", "\n"].includes(logs[i])) {
                            continue;
                        }
                        if (["}", "]", ","].includes(logs[i])) {
                            isLastOnLine = false;
                        }
                        break;
                    }
                    if (isLastOnLine) {
                        output += "\n" + tabs;
                    }
                    break;
                case "=":
                    isValue = true;
                    output += " " + currentChar + " ";
                    break;
                case ",":
                    isValue = false;
                    isInSentence = false;
                    output += currentChar + "\n" + tabs;
                    break;
                case "\t":
                case " ":
                case "\n":
                    if (isValue && isInSentence && !["\t", " ", "\n", ",", "]", "}"].includes(logs[currentCharIndex + 1])) {
                        output += currentChar;
                    }
                    break;
                default:
                    if (isValue) {
                        isInSentence = true;
                    }
                    output += currentChar;
                    break;
            }
        }
        outputElement.value = output;
    };
};