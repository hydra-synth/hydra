# Contributing Translation

Everyone is welcome to contribute translations - such as improvement of the existing pages, writing original contents and adding a new language support :)

## Type of Documents

* **[hydra-documents](contributing_translation?id=hydra-documents)**: Guides and this document, which can be found at https://hydra.ojack.xyz/docs/
* **[hydra-functions](contributing_translation?id=hydra-functions)**: the API reference, which can be found at https://hydra.ojack.xyz/api/
* **[hydra-editor](contributing_translation?id=hydra-editor)**: the main editor https://hydra.ojack.xyz/

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

The locale files are hosted on a dedicated repository: https://github.com/hydra-synth/l10n

### syntax

Open your editor and copy this:

```json
{
  "translation": {
    "language-name": "english",
    "toolbar": {
      "run": "Run all code (ctrl+shift+enter)",
      "upload": "upload to gallery",
      "clear": "clear all",
      "shuffle": "show random sketch",
      "random": "make random change",
      "show-info": "show info window",
      "hide-info": "hide info window"
    },
    "info": {
      "title": "hydra",
      "subtitle": "live coding video synth",
      "description": "Hydra is live code-able video synth and coding environment that runs directly in the browser. It is free and open-source and made for beginners and experts alike.",
      "get-started-title": "To get started:",
      "get-started-list": [
        "Close this window",
        "Change some numbers",
        "Type Ctrl + Shift + Enter"
      ],
      "description-detailed": "Hydra is written in JavaScript and compiles to WebGL under the hood. The syntax is inspired by analog modular synthesis, in which chaining or patching a set of transformations together generates a visual result.",
      "uses": "Hydra can be used:",
      "uses-list": [
        "to mix and add effects to camera feeds, screenshares, live streams, and videos",
        "to create generative and audio-reactive visuals, and share them online with others",
        "in combination with other javascript libraries such as P5.js, Tone.js, THREE.js, or gibber",
        "to add interactive video effects to a website",
        "to experiment with and learn about video feedback, fractals, and pixel operations",
        "to stream video between browsers and live-jam with others online"
      ],
      "author": "Created by <a {{author}}>olivia.</a>",
      "more-info": "For more information and instructions, see: <a {{docs}}>the interactive documentation</a>, <a {{functions}}>a list of hydra functions</a>, <a {{garden}}>the community database of projects and tutorials</a>, <a {{gallery}}>a gallery of user-generated sketches</a>, and <a {{repo}}>the source code on github</a>,",
      "more-info-forums": "There is also an active <a {{discord}}>Discord server</a> and <a {{facebook}}>facebook group</a> for hydra users+contributors.",
      "support": "If you enjoy using Hydra, please consider  <a {{open-collective}} >supporting continued development <3 </a>."
    }
  }
}
```

(from https://github.com/hydra-synth/hydra/blob/main/frontend/web-editor/src/stores/text-elements.js)

It should be self-explanatory; note that you have to edit the right hand side (for example, keep `"language-name"` and edit `"english"` to the language name in your language, e.g., `"日本語"` or `"español"`).

### testing your file

Before making a pull request on Github (submitting to Github), you can test the translation file. First, you need to host the settings file online. We explain two ways to host the file: Github or HackMD.

#### hosting on your Github repository

You can clone the l10n repository above, and then, for example, create a directory based on the [two-character language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) like this: https://github.com/micuat/l10n/blob/main/ja/editor.json

In this case, the raw file is https://raw.githubusercontent.com/micuat/l10n/main/ja/editor.json (you can generate the link by pressing "raw" button at the top right of the viewer)

#### hosting on HackMD

Github can be overwhelming, or even for advanced users, it may be cumbersome to test small edits. [HackMD](https://hackmd.io/) can be an easy way to edit live. Create your account, open a new document and paste your file to the online editor.

Let's say your file is https://hackmd.io/baEnGh7gRt2iHTvt-TT8Fw?edit

Then take `?` and anything after that: https://hackmd.io/baEnGh7gRt2iHTvt-TT8Fw

Append `/download` and that would be your direct link: https://hackmd.io/baEnGh7gRt2iHTvt-TT8Fw/download

### check on the editor!

To test on the editor, open a browser. Then, on the address bar, copy https://hydra.ojack.xyz/?l10n-lang=test&l10n-url= and add the direct link to your file directly after the `=` sign. For example, https://hydra.ojack.xyz/?l10n-lang=test&l10n-url=https://hackmd.io/baEnGh7gRt2iHTvt-TT8Fw/download

If there is no syntax error, the info window should have a tab with your translations. If there is an error, it may not appear. Please ask on [Discord server](https://discord.gg/ZQjfHkNHXC) or [Facebook group](https://www.facebook.com/groups/1084288351771117/) if you are not sure why it's not working!

### upload the changes

If you are using the Github way, then simply create a pull request.

If you are not familiar with Github, please open an [issue](https://github.com/hydra-synth/l10n/issues) with a link to your file so someone else can update the editor.

### reflect the locale on hydra editor

Finally, you need to add the language code to [this file on hydra editor](https://github.com/hydra-synth/hydra/blob/main/frontend/web-editor/src/stores/language-store.js) again by opening a pull request or submitting [an issue](https://github.com/hydra-synth/hydra/issues).

Thank you!
