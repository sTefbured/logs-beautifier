{
    const SKIP_NON_OBJECT_BODY_PART = "Skip non-object-body part";

    const createTextAreaBlock = () => {
        let textAreaWrapper = document.createElement("div");
        let textAreaElement = document.createElement("textarea");
        textAreaElement.style.width = "100%";
        textAreaElement.style.height = "50%";
        textAreaElement.style.resize = "vertical";
        textAreaWrapper.appendChild(textAreaElement);
        textAreaWrapper.getTextArea = () => textAreaElement;
        textAreaWrapper.style.width = "35%";
        return textAreaWrapper;
    };

    const createLabeledCheckbox = (labelText, isChecked) => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isChecked;
        checkbox.style.cursor = "pointer";

        let checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = labelText;
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.style.margin = "0 0 40px 0";
        checkboxLabel.style.cursor = "pointer";
        return checkboxLabel;
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

    const createGetResultButton = (inputElement, outputElement, parameterElementsMap) => {
        let button = document.createElement("button");
        button.textContent = "Get result";
        button.style.fontSize = "20px";
        button.style.height = "50px";
        button.style.cursor = "pointer";
        button.onclick = () => {
            let logs = inputElement.value;
            if (!logs) {
                return;
            }
            let isSkippingNonObjectBodyPart = parameterElementsMap[SKIP_NON_OBJECT_BODY_PART].checked;
            let currentCharIndex = 0;
            let output = "";
            if (isSkippingNonObjectBodyPart) {
                currentCharIndex = getObjectBodyStartIndex(logs);
                if (currentCharIndex > 0) {
                    output = logs.substring(0, currentCharIndex) + "\n";
                }
            }
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
                        if (
                            isValue &&
                            isInSentence &&
                            !["\t", " ", "\n", ",", "]", "}"].includes(
                                logs[currentCharIndex + 1]
                            )
                        ) {
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
        return button;
    };

    const createControlPanel = (logsInput, logsOutput) => {
        let parameterElementsMap = new Map();
        parameterElementsMap.set(SKIP_NON_OBJECT_BODY_PART, createLabeledCheckbox(SKIP_NON_OBJECT_BODY_PART, true));
        let getResultButton = createGetResultButton(logsInput, logsOutput, parameterElementsMap);
        let controlPanel = document.createElement("div");
        controlPanel.style.display = "flex";
        controlPanel.style.flexDirection = "column";
        parameterElementsMap.forEach(parameter => controlPanel.appendChild(parameter));
        controlPanel.appendChild(getResultButton);
    };

    const createWrapper = () => {
        let wrapper = document.createElement("div");
        wrapper.style.width = "80%";
        wrapper.style.height = "100%";
        wrapper.style.margin = "auto";
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "space-between";
        return wrapper;
    };

    const createUI = () => {
        let inputWrapper = createTextAreaBlock();
        let outputWrapper = createTextAreaBlock();
        let controlPanel = createControlPanel(inputWrapper.getTextArea(), outputWrapper.getTextArea());
        let wrapper = createWrapper();
        wrapper.appendChild(inputWrapper);
        wrapper.appendChild(controlPanel);
        wrapper.appendChild(outputWrapper);
        document.body.appendChild(wrapper);
        document.title = "Logs beautifier";
    };

    createUI();
}
