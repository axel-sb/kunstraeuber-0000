import { execSync, spawn } from 'child_process'

const result = execSync('code --list-extensions')

const list = String(result)
	.split('\n')
	.filter(Boolean)
	.map(
		(x) => `- [${x}](https://marketplace.visualstudio.com/items?itemName=${x})`,
	)
	.join('\n')

const proc = spawn('pbcopy')
proc.stdin.write(list)
proc.stdin.end()

/*
Here's a detailed explanation of the code:

1.  **Importing Modules**:

    `import {execSync, spawn} from 'child\_process'`

The script imports the execSync and spawn functions from the `child_process` module. These functions are used to execute shell commands and spawn new processes, respectively.

2.  **Executing Shell Command**:

    `const result = execSync('code --list-extensions')`

The execSync function runs the shell command `code --list-extensions`, which lists all the installed extensions in Visual Studio Code. The output of this command is captured in the result variable.

3.  **Processing the Result**:

```js
const list = String(result)
  .split('\\n')
  .filter(Boolean)
  .map(
    x =\> \- \[${x}\](https://marketplace.visualstudio.com/items?itemName=${x})\
  )
  .join('\\n')
```

The result is converted to a string and split into an array of extension names using the newline character (`\n`) as the delimiter. The filter(Boolean) method removes any empty strings from the array. The map function then formats each extension name into a Markdown list item with a link to its page on the Visual Studio Code Marketplace. Finally, the join('\\n') method combines the formatted list items into a single string with each item on a new line.

4.  **Copying to Clipboard**:

```js
const proc = spawn('pbcopy')
proc.stdin.write(list)
proc.stdin.end()
```


The spawn function is used to create a new process that runs the `pbcopy` command, which copies input to the clipboard on macOS. The formatted list is written to the standard input of the `pbcopy` process, and stdin.end() is called to signal the end of the input.


In summary, this script automates the process of generating a Markdown list of installed Visual Studio Code extensions and copying it to the clipboard, making it easy to share or document the extensions in use.
*/
