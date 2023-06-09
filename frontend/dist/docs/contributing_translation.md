# Contributing Translation

Everyone is welcome to contribute translations - such as improvement of the existing pages, writing original contents and adding a new language support :)

## Type of Documents

* **hydra-documents**: Guides and this document, which can be found at https://hydra.ojack.xyz/docs/
* **hydra-functions**: the API reference, which can be found at https://hydra.ojack.xyz/api/
* **hydra editor**: the main editor https://hydra.ojack.xyz/

## hydra-documents

hydra-documents are accessible at https://hydra.ojack.xyz/docs/ and the contents are hosted on [GitHub](https://github.com/hydra-synth/hydra-docs). In short, if you edit files on GitHub, they will be updated on the website (the first link).

Here we assume you are familiar with Git. If you are not familiar with it and want to make suggestions, don't worry - for small changes like typo, feel free to use "Edit this file" button on GitHub or open an [issue](https://github.com/hydra-synth/hydra-docs/issues) so someone can make the edit!

1. Fork and clone the repository https://github.com/hydra-synth/hydra-docs
1. If the language you contribute is not supported at all, create a folder with language code (e.g., `/ja` for Japanese). At the moment we don't use region code (e.g., `fr-ca` for French Canadian) - but feel free to suggest if that is necessary!
1. For translating articles existing in English (e.g., `getting_started.md`), create a file under the language folder with the same name (e.g., `/ja/getting_started.md`). For original contents, feel free to name it as you like :)
1. Translate the document!  
Tip 1: files are written in markdown format. It's important to keep the same structure as the English one (like `##` tag for headings). If you couldn't finish translating the whole file, leave remaining headings and texts in English so someone else or you can continue editing later.  
Tip 2: code blocks should have `javascript` tag as seen in the files in English so that they will be rendered with an embedded editor.
1. Feel free to add your name and contact to the translated file :)
1. Add a hyperlink to the file to `/_sidebar.md` - the translated contents go under a bullet point of the language (e.g., `Japanese | 日本語`). Otherwise, your contributed file won't appear on the sidebar :(
1. Make a git commit and push it to your GitHub repository!
1. Create a [pull request](https://github.com/hydra-synth/hydra-docs/pulls). We try our best to merge the edits as soon as possible!


## hydra-functions

hydra-functions are accessible at https://hydra.ojack.xyz/api/ and the contents are hosted on [GitHub](https://github.com/hydra-synth/hydra-functions). Currently, you need to manually build the javascript bundle.

stub:

1. Clone and fork the repository
1. `npm install`
1. edit here https://github.com/hydra-synth/hydra-functions/blob/main/locales.js
1. for examples, edit here https://github.com/hydra-synth/hydra-functions/blob/main/examples.js
1. `npm run build`
1. commit, push, PR


## hydra editor

currently not supported
