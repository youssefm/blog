---
layout: ../../layouts/PostLayout.astro
title: Writing Python in VS Code just got a whole lot better
description: "Developing Python applications in VS Code just got a lot better this week with the release of Pylance version 2022.12.21. It introduces a new option that lets you auto import user symbols, saving you time and reducing interruptions to your flow."
publishedOn: 2022-12-11
---

As you develop Python applications, one of the most common things you'll be doing is importing symbols: importing a class you want to instantiate, or a constant you want to use, or a function you want to call. If your editor isn't properly set up, this can be quite time-consuming. You have to scroll up to the top of your Python file, remember the path of the symbol you want to import, and type in an import statement:

```python
from app.models.order import Order
```

Not only is this time-consuming, but you've also just interrupted your flow. You were thinking about how to implement some algorithm or how some data structures relate and now you're suddenly having to switch to the banal exercise of adding another import at the top of your file.

## What is auto import?

Thankfully, code editors have come up with a solution to this: auto import. You simply start typing the name of the symbol you want to import and you see a list of suggestions of available symbols. When you select one of these by hitting enter, the code editor automatically adds the import statement at the top of your file for you.

Here's an example within VS Code itself:

![Auto import in VS Code](/auto-import.gif)

Notice how `import gc` automatically gets added for you by the editor at the top of the file.

## Auto importing user symbols in VS Code

So how do we get this feature working with Python in VS Code? Until recently, you couldn't get it fully working. You could get VS Code to suggest symbols in the standard library, in third-party Python modules, and in your own files that were opened in VS Code. But importantly, you couldn't get VS Code to suggest symbols in files you had not yet opened. This felt like a glaring omission to me so [I petitioned Microsoft to fix this](https://github.com/microsoft/pylance-release/issues/3670). And as of last week, they've added a new option to fix this.

To get auto import working with user symbols working in VS Code, first make sure you have the latest versions of the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) and [Pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance) VS Code extensions installed. Next, open the settings file by selecting "Preferences: Open User Settings (JSON)" in the command palette, and add the following lines:

```json{2-4}
{
  "python.analysis.autoImportCompletions": true,
  "python.analysis.autoImportUserSymbols": true,
  "python.analysis.indexing": true
}
```

That's it! You can now start typing in a Python file and you should see a list of all the symbols you can now auto import.

![Auto import working with user symbols](/auto-import-working.png)
