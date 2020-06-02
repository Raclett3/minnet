import { JSDOM } from 'jsdom';

export function parseHTML(html: string): string {
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  return convertNodes(document.body.childNodes).content;
}

type Converted = {
  content: string;
  isBlock: boolean;
};

function convertNodes(nodeList: NodeList): Converted {
  const nodes = Object.keys(nodeList).map(key => nodeList[Number(key)]);
  return joinConvertedArray(nodes.map(node => convertSingleNode(node)));
}

const blockNames = ['p', 'div', 'br'];

function convertSingleNode(node: Node): Converted {
  switch (node.nodeType) {
    case node.TEXT_NODE:
      return {
        content: node.textContent || '',
        isBlock: false,
      };

    case node.ELEMENT_NODE: {
      const nodeName = node.nodeName.toLowerCase();
      return {
        content: convertNodes(node.childNodes).content,
        isBlock: blockNames.includes(nodeName),
      };
    }
  }

  return {
    content: '',
    isBlock: false,
  };
}

function joinConvertedArray(convertedArray: Converted[]): Converted {
  if (convertedArray.length === 0) {
    return {
      content: '',
      isBlock: false,
    };
  }

  let result = convertedArray[0].content;
  let isLastElementBlock = convertedArray[0].isBlock;

  for (const converted of convertedArray.slice(1)) {
    if (isLastElementBlock) {
      result += '\n';
    }
    isLastElementBlock = converted.isBlock;
    result += converted.content;
  }

  return {
    content: result,
    isBlock: false,
  };
}
