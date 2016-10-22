declare module 'fast-html-parser' {
  export function parse(data: any, options: any): any
}

/**
 * Declare the module for options and other stuff
 */
declare module 'draggabilly' {
  // Interface for the draggabilly options
  interface IDraggabillyOptions {
    handle?: any;
    containment?: HTMLElement | boolean | string;
    axis?: string;
    grid?: [number, number];
  }

  // Interface for the movevector
  interface IMoveVector {
    x: number;
    y: number;
  }
  /**
   * Interface for the main object
   */
  class Draggabilly {
    constructor(element: any, options?: IDraggabillyOptions);

    // The on methods for usage in VanillaJS
    on(eventName: string, handler: (event: any, pointer: any) => {});
    on(eventName: string, handler: (event: any, pointer: any, moveVector: IMoveVector) => {});

    // The off methods for usage in VanillaJS
    off(eventName: string, handler: (event: any, pointer: any) => {});
    off(eventName: string, handler: (event: any, pointer: any, moveVector: IMoveVector) => {});

    // The once methods for usage in VanillaJS
    once(eventName: string, handler: (event: any, pointer: any) => {});
    once(eventName: string, handler: (event: any, pointer: any, moveVector: IMoveVector) => {});

    // Disable the dragging
    disable();

    // Destroy the draggable object
    destroy();

    // Enable the dragging
    enable();
  }
  namespace Draggabilly { }

  export = Draggabilly;
}