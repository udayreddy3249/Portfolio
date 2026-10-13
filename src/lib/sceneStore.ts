/**
 * Tiny shared state between the DOM (scroll, pointer) and the 3D hero scene.
 * Plain mutable object read inside the render loop, so updates never re-render React.
 */
export const sceneState = {
  /** 0 → 1 as the visitor scrolls through the hero */
  progress: 0,
  /** pointer position, -1 → 1 on each axis */
  mx: 0,
  my: 0,
};
