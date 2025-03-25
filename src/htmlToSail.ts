import * as parse5 from 'parse5';
import { Document, Element, TextNode, Node, ChildNode } from 'parse5/dist/tree-adapters/default';

// Self-closing tags in HTML
const selfClosingTags = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export function convertToSail(html: string): string {
  try {
    // Check if the HTML is a fragment (doesn't start with <!DOCTYPE> or <html>)
    const isFragment = !html.trim().toLowerCase().startsWith('<!doctype') && 
                      !html.trim().toLowerCase().startsWith('<html');
    
    if (isFragment) {
      // Parse as a fragment instead of a full document
      const fragment = parse5.parseFragment(html);
      return fragment.childNodes
        .map(child => processNode(child, 0))
        .join('\n')
        .trim();
    } else {
      // Parse as a full document
      const document = parse5.parse(html);
      return processNode(document, 0).trim();
    }
  } catch (error) {
    console.error('Error parsing HTML:', error);
    throw new Error('Invalid HTML structure');
  }
}

function processNode(node: Node, indentLevel: number): string {
  // Handle document node
  if (isDocument(node)) {
    return node.childNodes
      .map(child => processNode(child, indentLevel))
      .join('\n');
  }

  // Handle text nodes
  if (isTextNode(node as any)) {
    const text = (node as TextNode).value.trim();
    if (!text) {
      return '';
    }
    // For plain text lines, prepend with "; "
    return indent(indentLevel) + '; ' + text;
  }

  // Handle element nodes
  if (isElement(node)) {
    return processElement(node, indentLevel);
  }

  // Skip other node types (comments, etc.)
  return '';
}

function processElement(element: Element, indentLevel: number): string {
  const tagName = element.tagName;
  
  // Skip doctype
  if (tagName === '!doctype') {
    return '';
  }

  let result = indent(indentLevel) + ';' + tagName;
  
  // Handle id
  const id = getAttribute(element, 'id');
  if (id) {
    result += `#${id}`;
    removeAttribute(element, 'id');
  }
  
  // Do not specially handle classes - they'll be included in the attributes section
  // Classes should appear as (class "class-name") in Sail
  
  // Handle src for img, use @ notation
  if (tagName === 'img') {
    const src = getAttribute(element, 'src');
    if (src) {
      result += `@"${src}"`;
      removeAttribute(element, 'src');
    }
  }
  
  // Handle href for a, use / notation
  if (tagName === 'a') {
    const href = getAttribute(element, 'href');
    if (href) {
      result += `/"${href}"`;
      removeAttribute(element, 'href');
    }
  }
  
  // Handle attributes
  const attrs = element.attrs.filter(attr => attr.name !== 'id');
  if (attrs.length > 0) {
    const attrStr = attrs
      .map(attr => `${attr.name} "${attr.value}"`)
      .join(', ');
    result += `(${attrStr})`;
  }
  
  // Handle self-closing tags or elements with no children
  if (selfClosingTags.has(tagName) || element.childNodes.length === 0) {
    result += ';';
    return result;
  }
  
  // Handle elements with just text content
  if (element.childNodes.length === 1 && isTextNode(element.childNodes[0] as any)) {
    const text = (element.childNodes[0] as TextNode).value.trim();
    if (text) {
      result += ': ' + text;
      return result;
    }
  }
  
  // Handle elements with children
  result += '\n';
  element.childNodes.forEach(child => {
    const childResult = processNode(child, indentLevel + 2);
    if (childResult) {
      result += childResult + '\n';
    }
  });
  
  result += indent(indentLevel) + '==';
  return result;
}

function getAttribute(element: Element, name: string): string | null {
  if (!element.attrs) {
    return null;
  }
  const attr = element.attrs.find(attr => attr.name === name);
  return attr ? attr.value : null;
}

function removeAttribute(element: Element, name: string): void {
  if (!element.attrs) {
    return;
  }
  const index = element.attrs.findIndex(attr => attr.name === name);
  if (index !== -1) {
    element.attrs.splice(index, 1);
  }
}

function indent(level: number): string {
  return ' '.repeat(level);
}

// Type guards
function isDocument(node: Node): node is Document {
  return node.nodeName === '#document';
}

function isElement(node: Node): node is Element {
  return node.nodeName !== '#text' && node.nodeName !== '#document' && 'tagName' in node;
}

function isTextNode(node: any): node is TextNode {
  return node.nodeName === '#text';
}