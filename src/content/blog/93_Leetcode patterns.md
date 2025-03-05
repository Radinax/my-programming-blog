---
title: "Leetcode: Common questions and patterns"
description: "Leetcode you like it or not, is used a lot these days, its a tool to help us become better programmers and we need to know how to answer their questions"
category: ["leetcode"]
pubDate: "2025-01-26"
published: true
---

## Table of contents

---

# Introduction

In 2025 the market has been in a rough spot for developers all over the world, while before we didn't really need to be good at Leetcode since why should we know how to reverse a binary tree when we can build products, these days of AI supremacy has been changing things for us, so now its more important than ever to know algorithms and concepts of computer science in order to properly become more valuable in today's market.

Leetcode is a platform used by companies to challenge the candidates knowledge of the basics, its very important to be able to solve at least the easy Leetcode problems without problems and go from there.

It might be a bit difficult at first but there are some patterns we can check in this article and how to solve them.

---

## 1. Two Pointers

Used for problems involving arrays or linked lists, where you use two pointers to traverse the data structure.

**Example 1: Two Sum II (LeetCode 167)**  
 Problem: Given a sorted array, find two numbers that add up to a target.

```javascript
function twoSum(numbers, target) {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1]; // 1-based indexing
    else if (sum < target) left++;
    else right--;
  }
  return [];
}
```

**Example 2: Remove Duplicates from Sorted Array (LeetCode 26)**  
 Problem: Remove duplicates in-place from a sorted array.

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}
```

---

## 2. Sliding Window

Used for subarray or substring problems where you maintain a "window" of elements.

**Example 1: Maximum Subarray (LeetCode 53)**  
 Problem: Find the contiguous subarray with the largest sum.

```javascript
function maxSubArray(nums) {
  let maxSum = nums[0],
    currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

**Example 2: Longest Substring Without Repeating Characters (LeetCode 3)**  
 Problem: Find the length of the longest substring without repeating characters.

```javascript
function lengthOfLongestSubstring(s) {
  let charSet = new Set();
  let left = 0,
    maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

---

## 3. Binary Search

Used for searching in sorted arrays or solving optimization problems.

**Example 1: Binary Search (LeetCode 704)**  
 Problem: Find the index of a target value in a sorted array.

```javascript
function search(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

**Example 2: Find First and Last Position of Element in Sorted Array (LeetCode 34)**  
 Problem: Find the starting and ending position of a target value in a sorted array.

```javascript
function searchRange(nums, target) {
  function findFirst() {
    let left = 0,
      right = nums.length - 1,
      result = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] >= target) right = mid - 1;
      else left = mid + 1;
      if (nums[mid] === target) result = mid;
    }
    return result;
  }

  function findLast() {
    let left = 0,
      right = nums.length - 1,
      result = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (nums[mid] <= target) left = mid + 1;
      else right = mid - 1;
      if (nums[mid] === target) result = mid;
    }
    return result;
  }

  return [findFirst(), findLast()];
}
```

---

## 4. Depth-First Search (DFS) and Breadth-First Search (BFS)

Used for tree and graph traversal.

**Example 1: Maximum Depth of Binary Tree (LeetCode 104)**  
 Problem: Find the maximum depth of a binary tree using DFS.

```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**Example 2: Binary Tree Level Order Traversal (LeetCode 102)**  
 Problem: Perform a BFS traversal of a binary tree.

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
```

---

## 5. Dynamic Programming (DP)

Used for optimization problems with overlapping subproblems.

**Example 1: Climbing Stairs (LeetCode 70)**  
 Problem: Find the number of ways to climb `n` stairs.

```javascript
function climbStairs(n) {
  if (n === 1) return 1;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

**Example 2: House Robber (LeetCode 198)**  
 Problem: Maximize the amount of money you can rob without alerting the police.

```javascript
function rob(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length + 1).fill(0);
  dp[1] = nums[0];
  for (let i = 2; i <= nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
  }
  return dp[nums.length];
}
```

---

## 6. Backtracking

Used for problems involving permutations, combinations, or exhaustive search.

**Example 1: Subsets (LeetCode 78)**  
 Problem: Generate all possible subsets of a set.

```javascript
function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}
```

**Example 2: Permutations (LeetCode 46)**  
 Problem: Generate all permutations of a set.

```javascript
function permute(nums) {
  const result = [];
  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let num of nums) {
      if (!path.includes(num)) {
        path.push(num);
        backtrack(path);
        path.pop();
      }
    }
  }
  backtrack([]);
  return result;
}
```

---

## 7. Greedy Algorithms

Used for problems where local optimal choices lead to a global solution.

**Example 1: Best Time to Buy and Sell Stock II (LeetCode 122)**  
 Problem: Maximize profit by buying and selling stocks multiple times.

```javascript
function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}
```

**Example 2: Assign Cookies (LeetCode 455)**  
 Problem: Assign cookies to children to maximize satisfaction.

```javascript
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0,
    j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) i++;
    j++;
  }
  return i;
}
```

---

## 8. Hash Tables

Used for frequency counting or lookups.

**Example 1: Two Sum (LeetCode 1)**  
 Problem: Find two numbers that add up to a target.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
```

**Example 2: Contains Duplicate (LeetCode 217)**  
 Problem: Check if an array contains duplicates.

```javascript
function containsDuplicate(nums) {
  const set = new Set();
  for (let num of nums) {
    if (set.has(num)) return true;
    set.add(num);
  }
  return false;
}
```

---

## 9. Stack/Queue

Used for problems involving LIFO or FIFO operations.

**Example 1: Valid Parentheses (LeetCode 20)**  
 Problem: Check if a string of parentheses is valid.

```javascript
function isValid(s) {
  const stack = [];
  const map = { ")": "(", "}": "{", "]": "[" };
  for (let char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
```

**Example 2: Implement Queue using Stacks (LeetCode 232)**  
 Problem: Implement a queue using two stacks.

```javascript
class MyQueue {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  push(x) {
    this.stack1.push(x);
  }

  pop() {
    if (this.stack2.length === 0) {
      while (this.stack1.length) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2.pop();
  }

  peek() {
    if (this.stack2.length === 0) {
      while (this.stack1.length) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2[this.stack2.length - 1];
  }

  empty() {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}
```

---

# Conclusion

There are some interesting patterns here you can learn, while there could be more questions involved, these usually be similar to the ones you will be asked in interviews.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
