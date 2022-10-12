# logs-beautifier

## What it does
This tool is intended to convert not-formatted single-line strings of logs/json/whatever to structured text.

Example:
We have a line of logs with an object in it
```
10:10:12.345 21/01/2020 [INFO] SomeClassName - Something was called with params: {id: 1232123432342, someInnerObject: {id:333321232143232, name: Object, property1: 10}, property1: 10, property2: 222}
```
This line is not that easy to read, especially when logged object is huge.

Logs beautifier makes it look like this
```
10:10:12.345 21/01/2020 [INFO] SomeClassName - Something was called with params:
{
    id: 1232123432342,
    someInnerObject:{
        id: 333321232143232,
        name: Object,
        property1: 10
    },
    property1: 10,
    property2: 222
}

```

## How to use
### Works on Chrome and partially on Firefox (details below)
Create a bookmark and paste the code below into `URL` field
```javascript
javascript:
{
    (function openBeautifier() {
        let blankPage;
        if (document.documentURI === "about:blank") {
            while (document.body.firstChild) {
                document.body.firstChild.remove();
            }
            blankPage = window;
        } else {
            blankPage = window.open("about:blank", "_blank");
        }
    
        let beautifierScript = blankPage.document.createElement("script");
        beautifierScript.type = "module";
        beautifierScript.src = "https://stefbured.github.io/logs-beautifier/pageBuilder.js";
        blankPage.document.body.appendChild(beautifierScript);
    
        let metaTag = blankPage.document.createElement("meta");
        metaTag.httpEquiv = "Content-Security-Policy";
        metaTag.content = "script-src 'unsafe-eval' https://*;";
        blankPage.document.head.appendChild(metaTag);
    })();
}
```
Now on any page (except some cases) click on the created bookmark. The script will open an `about:blank` page and for Chrome it will create some UI. 
In case of Firefox browser you'll need to click the bookmark again and then UI also will be created.

On the left is source text area, where source text should be inserted.

In the middle there is a button, by clicking on which text from the right text area will be converted and inserted into the left text area.
