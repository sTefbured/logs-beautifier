import {createOnClick} from "./onClickBuilder.js";
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

    const createGetResultButton = (inputElement, outputElement, parameterElementsMap) => {
        let button = document.createElement("button");
        button.textContent = "Get result";
        button.style.fontSize = "20px";
        button.style.height = "50px";
        button.style.cursor = "pointer";
        button.onclick = createOnClick(inputElement, outputElement, parameterElementsMap);
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
        return controlPanel;
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
