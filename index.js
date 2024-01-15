const parser = new DOMParser();
let stack = [];
let parentStack = [];

var element = "";
var doc;


document.getElementById('submit').addEventListener("click", function () {
    element = "";
    doc = parser.parseFromString(document.getElementById('code').value, "text/html");
    //console.log(doc)
    returnCode(doc.body);

    //console.log(element);


    shiki
        .getHighlighter({
            theme: 'min-dark'
        })
        .then(highlighter => {
            const code = highlighter.codeToHtml(element, 'js')
            document.getElementById('output').innerHTML = code
            document.getElementById('outputContainer').style.opacity = "1";
        })

});


function returnCode(doc) {
    if (doc.children.length > 0) {

        for (let i = 0; i < doc.children.length; i++) {

            let variableName = randomize(doc.children[i]);

            if (element.includes(variableName)) {
                let initialCount = variableName.length;
                for (let i = 2; i < 999; i++) {
                    variableName = variableName + i;
                    if (!(element.includes(variableName))) {
                        break;
                    } else {
                        variableName = variableName.substring(0, initialCount);
                    }
                }
            }

            element = element.concat(`
                var ` + variableName + ` = document.createElement('` + doc.children[i].tagName + `');
                `);

            if (doc.children[i].attributes.length > 0) {
                for (let index = 0; index < doc.children[i].attributes.length; index++) {
                    element = element.concat(`
                    `+ variableName + `.setAttribute("` + doc.children[i].attributes[index].nodeName + `","` + doc.children[i].attributes[index].nodeValue + `");
                    `);
                }
            }
            if (!(doc.children[i]).innerHTML.includes("<")) {
                if (doc.children[i].innerText != "" && doc.children[i].innerText != undefined) {
                    element = element.concat(`
                    ` + variableName + `.innerHTML = \`` + doc.children[i].innerText + `\`;
                    `);
                    doc.children[i].innerHTML = doc.children[i].innerText
                }
            }

            stack.push(variableName);
            returnCode(doc.children[i]);
            stack.pop();


            if (stack[stack.length - 1] != undefined) {
                element = element.concat(`
                ` + stack[stack.length - 1] + `.appendChild(` + variableName + `);
                `);
            }
        }
    }
}

function randomize(element) {
    var result = '';
    if (element.classList.value != "") {
        result = element.tagName + element.classList[0];
        result = result.replaceAll("-", "_");
    } else {
        var characters = '12345789';
        var charactersLength = characters.length;
        result = element.tagName;
        for (var i = 0; i < 2; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
    }
    return result;
}

async function copyToClipBoard() {

    var e = element;
    t = document.createElement("textarea");
    document.body.appendChild(t);
    t.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value = e;
    await t.select();
    await document.execCommand("copy");
    document.body.removeChild(t);
    alert("Copied code to Clipboard!");

}
