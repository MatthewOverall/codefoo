/// <reference path="../../external_typings/monaco.d.ts" />

export class Editor {

  editor: monaco.editor.IStandaloneCodeEditor

  languages: monaco.languages.ILanguageExtensionPoint[] = []
  files: EditorFile[] = []
  activeFile: EditorFile

  constructor(private _element: HTMLElement, options: monaco.editor.IEditorConstructionOptions = {}) {
    this.languages = monaco.languages.getLanguages()
    this.editor = monaco.editor.create(this._element, options)
  }

  static async loadMonaco(): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      (<any>window).require(['vs/editor/editor.main'], () => {
        (<any>window).monaco = monaco
        resolve(monaco)
      })
    })
  }

  activateFile(editorFile: EditorFile): void {
    if (this.activeFile) {
      this.activeFile.viewState = this.editor.saveViewState()
    }
    this.activeFile = editorFile
    this.editor.setModel(editorFile.model);
    this.editor.restoreViewState(editorFile.viewState);
    this.editor.updateOptions({
      // readOnly: editorFile.file.readonly
    })
    this.editor.focus();
  }

  getExtensionLanguage(ext: string): string {
    return this.languages.find(x =>
      x.extensions.some(e => e.toLowerCase() === ext.toLowerCase())
    ).id
  }

  loadFile(file: File): EditorFile {
    let editorFile = this.files.find(x => x.file === file)
    if (!editorFile) {
      //see if dupe uri
      let model = monaco.editor.createModel((<any>file).content, null, monaco.Uri.parse(file.name))
      editorFile = new EditorFile(file, model)
      // model.onDidChangeContent(x => workbench.fileChanged(editorFile, x))
      this.files.push(editorFile)
    }
    return editorFile
  }

  openFile(file: File): void {
    let editorFile = this.loadFile(file)
    this.activateFile(editorFile)
  }

  reset(): void {
    this.files.forEach(x => x.model.dispose())
    this.files = []
    this.activeFile = null
    this.editor.setModel(null)
  }

  updateFile(file: File) {
    let ef = this.files.find(x => x.file === file)
    if (ef) {
      ef.model.setValue((<any>file).content)
    }
  }
}

export class EditorFile {
  isActive: boolean
  constructor(
    public file: File,
    public model: monaco.editor.IModel,
    public viewState?: monaco.editor.IEditorViewState
  ) { }
}
