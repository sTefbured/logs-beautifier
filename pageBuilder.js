blankPage = window;
createTextAreaBlock = () => {
    let textAreaWrapper = blankPage.document.createElement("div");
    let textAreaElement = blankPage.document.createElement("textarea");
    textAreaElement.style.width = "100%";
    textAreaElement.style.height = "50%";
    textAreaElement.style.resize = "vertical";
    textAreaWrapper.appendChild(textAreaElement);
    textAreaWrapper.getTextArea = () => textAreaElement;
    textAreaWrapper.style.width = "35%";
    return textAreaWrapper;
};

wrapper = blankPage.document.createElement("div");
wrapper.style.width = "80%";
wrapper.style.height = "100%";
wrapper.style.margin = "auto";
wrapper.style.display = "flex";
wrapper.style.justifyContent = "space-between";
inputWrapper = createTextAreaBlock();
outputWrapper = createTextAreaBlock();

controlPanel = blankPage.document.createElement("div");
controlPanel.style.display = "flex";
controlPanel.style.flexDirection = "column";

skipFirstCheckbox = blankPage.document.createElement("input");
skipFirstCheckbox.type = "checkbox";
skipFirstCheckbox.checked = true;
skipFirstCheckbox.style.cursor = "pointer";

skipFirstCheckboxLabel = blankPage.document.createElement("label");
skipFirstCheckboxLabel.textContent = "Skip non-object-body part";
skipFirstCheckboxLabel.appendChild(skipFirstCheckbox);
skipFirstCheckboxLabel.style.margin = "0 0 40px 0";
skipFirstCheckboxLabel.style.cursor = "pointer";
controlPanel.appendChild(skipFirstCheckboxLabel);

getResultButton = blankPage.document.createElement("button");
getResultButton.textContent = "Get result";
getResultButton.style.fontSize = "20px";
getResultButton.style.height = "50px";
getResultButton.style.cursor = "pointer";
controlPanel.appendChild(getResultButton);

wrapper.appendChild(inputWrapper);
wrapper.appendChild(controlPanel);
wrapper.appendChild(outputWrapper);
blankPage.document.body.appendChild(wrapper);
blankPage.document.title = "Logs beautifier";



getTabs = (count) => {
    let result = "";
    while (count--) {
        result += '    ';
    }
    return result;
};

getObjectBodyStartIndex = (logs) => {
    const PARAMS_STR = "with params";
    const RESULT_STR = "with result";
    let paramsIndex = logs.indexOf(PARAMS_STR);
    paramsIndex = (paramsIndex < 0) ? Number.POSITIVE_INFINITY : paramsIndex + PARAMS_STR.length;
    let resultIndex = logs.indexOf(RESULT_STR);
    resultIndex = (resultIndex < 0) ? Number.POSITIVE_INFINITY : resultIndex + RESULT_STR.length;
    let result = Math.min(paramsIndex, resultIndex);
    if (result === Number.POSITIVE_INFINITY) {
        return 0;
    }
    if (logs[result] === ':') {
        result++;
    }
    return result;
};

blankPage.logsInput = inputWrapper.getTextArea();
blankPage.logsOutput = outputWrapper.getTextArea();
blankPage.skipFirstCheckboxElement = skipFirstCheckbox;

getResultButton.onclick = () => {
    let logs = blankPage.logsInput.value;
    if (!logs) {
        return;
    }
    let isSkippingNonObjectBodyPart = blankPage.skipFirstCheckboxElement.checked;
    let currentCharIndex = 0;
    let output = "";
    if (isSkippingNonObjectBodyPart) {
        currentCharIndex = getObjectBodyStartIndex(logs);
        if (currentCharIndex > 0) {
            output = logs.substring(0, currentCharIndex) + '\n';
        }
    }
    let tabsCount = 0;
    let tabs = "";
    let isValue = false;
    let isInSentence = false;
    for (currentCharIndex; currentCharIndex < logs.length; currentCharIndex++) {
        let currentChar = logs[currentCharIndex];
        switch (currentChar) {
            case '[':
            case '{':
                isValue = false;
                isInSentence = false;
                tabs = getTabs(++tabsCount);
                output += currentChar + '\n' + tabs;
                break;
            case ']':
            case '}':
                isValue = false;
                isInSentence = false;
                tabs = getTabs(--tabsCount);
                output += '\n' + tabs + currentChar;
                let isLastOnLine = true;
                for (let i = currentCharIndex + 1; i < logs.length; i++) {
                    if (['\t', ' ', '\n'].includes(logs[i])) {
                        continue;
                    }
                    if (['}', ']', ','].includes(logs[i])) {
                        isLastOnLine = false;
                    }
                    break;
                }
                if (isLastOnLine) {
                    output += '\n' + tabs;
                }
                break;
            case '=':
                isValue = true;
                output += ' ' + currentChar + ' ';
                break;
            case ',':
                isValue = false;
                isInSentence = false;
                output += currentChar + '\n' + tabs;
                break;
            case '\t':
            case ' ':
            case '\n':
                if (isValue && isInSentence && !['\t', ' ', '\n', ',', ']', '}'].includes(logs[currentCharIndex + 1])) {
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
    blankPage.logsOutput.value = output;
}
