export interface ISelectComponent {
  canBeRestored(): boolean;

  hasSelected(): boolean;

  hasSource(): boolean;
}
