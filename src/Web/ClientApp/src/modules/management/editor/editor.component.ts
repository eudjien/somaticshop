import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import 'jqueryui';
import Quill, {DeltaStatic, Sources} from 'quill';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('editor') editor: ElementRef;

  private quill: Quill;

  constructor() {
  }

  setContents(delta: DeltaStatic, source?: Sources): DeltaStatic {
    return this.quill.setContents(delta, source);
  }

  setText(text: string, source?: Sources): void {
    this.quill.setText(text, source);
  }

  getContents(index?: number, length?: number): DeltaStatic {
    return this.quill.getContents(index, length);
  }

  stringify(): string {
    return JSON.stringify(this.quill.getContents().ops);
  }

  parse(content: string): void {
    try {
      this.quill.setContents(JSON.parse(content));
    } catch (SyntaxError) {
      this.quill.setText(content);
    }
  }

  ngAfterViewInit(): void {
    this.initQuill();
    this.initResizableContainer();
  }

  ngOnInit(): void {
  }

  getQuill(): Quill {
    return this.quill;
  }

  getHtmlFromQuillDelta(options?: any) {
    const cfg = options || {inlineStyles: true};
    const converter = new QuillDeltaToHtmlConverter(this.quill.getContents().ops, cfg);
    return converter.convert();
  }

  private initQuill(): void {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement
      },
      theme: 'snow'
    });
  }

  private initResizableContainer(): void {
    const minHeight = 280;
    $(this.editor.nativeElement).css({height: minHeight + 'px'}).resizable({
      minHeight: minHeight,
      handles: 's'
    });
  }
}
