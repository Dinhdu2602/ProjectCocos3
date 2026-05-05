import { Node, isValid } from "cc";

export class NodeUtils {
  /**
   * Clear all node in list:
   * - destroy node
   * - remove from array
   */
  static clearNodes(list: Node[]) {
    if (!list || list.length === 0) return;

    for (let i = list.length - 1; i >= 0; i--) {
      const node = list[i];

      if (isValid(node)) {
        node.destroy();
      }

      list.splice(i, 1);
    }
  }

  /**
   * Remove node invalid from list (no destroy)
   */
  static removeInvalidNodes(list: Node[]) {
    if (!list || list.length === 0) return;

    for (let i = list.length - 1; i >= 0; i--) {
      if (!isValid(list[i])) {
        list.splice(i, 1);
      }
    }
  }
}