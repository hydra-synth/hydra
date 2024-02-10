import { EditorView } from "@codemirror/view"
import { HighlightStyle } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"

export const hydraSyntaxStyle = HighlightStyle.define([
    {
      tag: t.keyword,
      color: 'white'
    },
    { tag: t.name, color: 'pink' },
    {
      tag: [t.deleted, t.character, t.propertyName, t.macroName],
      color: 'white'
    },
    {
      tag: [t.function(t.variableName), t.labelName],
      color: 'white'
    },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: '#ff0'
    },
    {
      tag: [t.definition(t.name), t.separator],
      color: 'white'
    },
  ])

  export const hydraEditorTheme =  EditorView.theme({
    '&': {
      backgroundColor: 'transparent !important',
      fontSize: '20px',
      width: '100%',
      height: '100%',
      // color: 'white',
      fontFamily: `'Roboto Mono', monospace`,
      // mixBlendMode: 'difference'
    },
    '& .cm-content': {
        width: '100%',
      whiteSpace: 'break-spaces'
    },
    '& .cm-editor':  {
        backgroundColor: 'transparent',
    },
    '& .cm-scroller': {
      fontFamily: `'Roboto Mono', monospace`
    },
    '& .cm-focused': {
        background: 'hsla(50,23%,5%,0.6)',
    },
    '& .cm-line': {
      maxWidth: 'fit-content',
      background: 'hsla(50,23%,5%,0.6)',
      padding: '0px'
      ///  background: 'rgba(0, 0, 0, 1)'
      // background: 'blue'
    },
    '.ͼo .cm-activeLine': {
        backgroundColor: 'hsla(50,23%,5%,0.6)',
      // background: 'red',
      // color: 'black'
    },
    '& .ͼo': {
      color: 'white'
    },
    '& .cm-tooltip.cm-tooltip-autocomplete > ul': {
      minWidth: '80px',
      fontFamily: `'Roboto Mono', monospace`
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '& .cm-gutters': {
      background: 'none'
    },
    '& .cm-tooltip': {
      background: `rgba(0, 0, 0, 0.5)`,
      // color: '#abb2bf'
    },
    '& .cm-tooltip-autocomplete > ul > li[aria-selected]': {
      color: 'white',
      // color: '#abb2bf',
      backgroundColor: 'rgba(255, 0, 0, 0.7)'
    },
    '.cm-completionInfo': {
      // fontFamily: 'monospace',
      fontFamily: `'Roboto Mono', monospace`,
      fontStyle: 'italic',
      // color: '#abb2bf',
      padding: '1.5px 9px'
    },
    '.cm-completionIcon': {
      width: '4px',
      height: '10px',
      opacity: 1,
      paddingRight: '0px',
      marginRight: '6px'
    },
    '.cm-completionIcon-src': {
      backgroundColor: 'orange',
    },
    '.cm-completionIcon-coord': {
      backgroundColor: 'yellow',
    },
    '.cm-completionIcon-color': {
      backgroundColor: 'lightgreen',
    },
    '.cm-completionIcon-combine': {
      backgroundColor: 'lightblue',
    },
    '.cm-completionIcon-combineCoord': {
      backgroundColor: 'purple',
    },
    '.cm-completionIcon-src:after': {
      content: 'ƒ'
    },
    // linter styles
    '.cm-panels': {
      background: 'none',
    },
    '.cm-panels.cm-panels-bottom': {
      border: 'none'
    },
    '.cm-diagnostic-info': {
      border: 'none',
    },
    '.cm-diagnostic-error': {
      background: 'none',
      color: 'red'
    },
    '.cm-panel.cm-panel-lint ul [aria-selected]': {
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    '.cm-lint-marker-info': {
      content: 'none'
    },
    '.cm-cursor': {
      borderLeft: '4px solid white',
      borderRight: '4px solid black'
    }
    // '.ͼ1 .cm-panel.cm-panel-lint ul [aria-selected]': {
    //   background: 'none',
    //   color: 'red'
    // }
    // // adds word wrapping
    // '.cm-content': {
    //   whiteSpace: 'pre-wrap'
    // }
  })