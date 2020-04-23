<template>
    <div class="text-editor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive}">
            <div class="btn-toolbar">
                <div class="btn-group mr-2">
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.bold() }" @click="commands.bold"><i class="fa fa-bold"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.italic() }" @click="commands.italic"><i class="fa fa-italic"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.strike() }" @click="commands.strike"><i class="fa fa-strikethrough"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.underline() }" @click="commands.underline"><i class="fa fa-underline"></i></button>
                </div>
                <div class="btn-group mr-2">
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">H1</button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">H2</button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">H3</button>
                </div>
                <div class="btn-group mr-2">
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list"><i class="fa fa-list-ul"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list"><i class="fa fa-list-ol"></i></button>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote"><i class="fa fa-quote-right"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.link() }" @click="commands.link"><i class="fa fa-link"></i></button>
                    <button type="button" class="btn btn-light" :class="{ 'is-active': isActive.code() }" @click="commands.code"><i class="fa fa-code"></i></button>
                </div>
            </div>
        </editor-menu-bar>
        <editor-content class="editor__content" :editor="editor" />
    </div>
</template>
<script>
    import { Editor, EditorContent, EditorMenuBar} from 'tiptap';
    import {
        Bold, Blockquote, BulletList, Heading,
        OrderedList, ListItem, Link, Code,
        Italic, Strike, Underline
    } from 'tiptap-extensions';

    export default {
        name: "TextEditor",
        props: ['value'],
        components: {
            EditorContent,
            EditorMenuBar,
        },
        data() {
            return {

                editor: new Editor({
                    content: this.value,
                    extensions: [
                        new Bold(),
                        new Italic(),
                        new Strike(),
                        new Underline(),
                        new Heading({ levels: [1, 2, 3] }),
                        new ListItem(),
                        new BulletList(),
                        new OrderedList(),
                        new Blockquote(),
                        new Link(),
                        new Code(),
                    ],
                    onUpdate: ({getHTML}) => {
                        this.$emit('input', getHTML());
                    }
                }),
            }
        },
        methods: {
        },
        beforeDestroy() {
            this.editor.destroy();
        },
    }

</script>
<style scoped>
    .text-editor .btn-toolbar {
        background-color: #f6fcfe;
    }

    .editor {
        position: relative;
        margin: 0 auto 5rem auto;
    }

    .editor__content {
        padding: 16px 22px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        height: 100%;
    }
    .editor__content * {
        caret-color: currentColor;
    }

    .editor__content pre {
        padding: 0.7rem 1rem;
        border-radius: 5px;
        background: #000;
        color: #fff;
        font-size: 0.8rem;
        overflow-x: auto;
    }

    .editor__content pre code {
        display: block;
    }

    .editor__content p code {
        display: inline-block;
        padding: 0 0.4rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        background: rgba(0,0,0, 0.1);
        color: rgba(0,0,0, 0.8);
    }

    .editor__content ul,
    .editor__content ol {
        padding-left: 1rem;
    }

    .editor__content li > p,
    .editor__content li > ol,
    .editor__content li > ul {
        margin: 0;
        margin-bottom: 0;
    }

    .editor__content a {
        color: inherit;
    }

    .editor__content blockquote {
        border-left: 3px solid rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, 0.8);
        padding-left: 0.8rem;
        font-style: italic;
    }

    .editor__content blockquote p {
        margin: 0;
    }

    .editor__content img {
        max-width: 100%;
        border-radius: 3px;
    }

    .editor__content table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;
    }

    .editor__content table td, th {
        min-width: 1em;
        border: 2px solid #ccc;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
    }

    .editor__content table td > *,
    .editor__content table th > * {
        margin-bottom: 0;
    }

    .editor__content table th {
        font-weight: bold;
        text-align: left;
    }

    .editor__content table .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0; right: 0; top: 0; bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
    }

    .editor__content table .column-resize-handle {
        position: absolute;
        right: -2px; top: 0; bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
    }

    .editor__content .tableWrapper {
        margin: 1em 0;
        overflow-x: auto;
    }

    .editor__content .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
    }

</style>
<style>
    .ProseMirror:focus, .ProseMirror-focused {
        outline: none!important;
    }
</style>