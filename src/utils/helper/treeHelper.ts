// 树工具类的操作字段类型
interface TreeHelperConfig {
  // id的字段名
  id: string;
  // 子级的字段名
  children: string;
  // 父id的字段名
  pid: string;
}
// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  // id的字段名默认是id
  id: 'id',
  // 子级的字段名默认是children
  children: 'children',
  // 父id的字段名默认是pid
  pid: 'pid',
};

// 获取树工具配置，合并三个对象并返回
// Partial将类型的key全部变成可选类型
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

// tree from list
// 从List结构中获取树结构
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  // 获取树结构的关键字段名
  const conf = getConfig(config) as TreeHelperConfig;
  // 节点Map
  const nodeMap = new Map();
  // 返回的树结果
  const result: T[] = [];
  // 获取关键字段名
  const { id, children, pid } = conf;

  // 将数组遍历一遍,放到Map中去
  for (const node of list) {
    // 将List中的children字段设置成数组
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  // 再将数组遍历一遍处理上下级关系
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent.children : result).push(node);
  }
  return result;
}

export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  // 获取关键字段
  config = getConfig(config);
  // 获取子级的字段
  const { children } = config;
  // 展开tree赋值给结果
  const result: any = [...tree];
  // 遍历结果
  for (let i = 0; i < result.length; i++) {
    // 如果没有子级就算了
    if (!result[i][children!]) continue;
    // 如果有子集在下一个位置将子集展开插入
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

// 从树结构中找一个节点
export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | null {
  config = getConfig(config);
  const { children } = config;
  // 展开树
  const list = [...tree];
  for (const node of list) {
    // 如果找到节点了直接返回
    if (func(node)) return node;
    // 如果没有找到节点,并且节点存在子节点,那么将子节点放在数组后面,等待遍历
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

// 从树结构中找多个节点
// 逻辑类似同上
export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

// 从树结果中获取一个符合条件的节点,并返回其所有父节点
export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {}
): T | T[] | null {
  config = getConfig(config);
  // 待输出的路径
  const path: T[] = [];
  // 展开树
  const list = [...tree];
  // 观察过的节点Set
  const visitedSet = new Set();
  // children字段名
  const { children } = config;
  // 遍历list
  while (list.length) {
    // 拿第一个节点
    const node = list[0];
    if (visitedSet.has(node)) {
      // 如果观察过的节点中有这个节点,那么
      // 删除path最后一个元素
      // 如果进到这个代码块中,就已经说明这个节点下的所有子节点都已经遍历完了,还是没有找到对应的节点,所以肯定要删除掉
      path.pop();
      // list删除第一个元素
      list.shift();
    } else {
      // 如果观察过的节点没有这个节点,那么
      // 添加该节点
      visitedSet.add(node);
      // 如果节点有子集 那么在list的前面添加这些子集
      node[children!] && list.unshift(...node[children!]);
      // 路径加入这个节点
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

// 逻辑同上,获取多个
export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set(),
    { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

// 树结构
// 过滤函数
// 树结构的配置
export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  // 获取树结构的配置
  config = getConfig(config);
  // 获取树结构的子集
  const children = config.children as string;
  // List过滤
  function listFilter(list: T[]) {
    return (
      list
        .map((node: any) => ({ ...node }))
        // 过滤
        .filter((node) => {
          node[children] = node[children] && listFilter(node[children]);
          // true返回、false过滤 或者 子级存在
          return func(node) || (node[children] && node[children].length);
        })
    );
  }
  // 执行过滤
  return listFilter(tree);
}

// 树结构所有节点执行一遍func
export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {}
): void {
  config = getConfig(config);
  const list: any[] = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    func(list[i]);
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * 类似于数组的map方法,一样的道理
 * @description: Extract tree specified structure
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * 就是将一个树节点按照conversion方法处理一遍,子集也会这样处理
 * @description: Extract tree specified structure
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn }
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  // 如果有子节点,将子节点都处理一遍然后输出
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        })
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

