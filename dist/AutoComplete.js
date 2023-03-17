"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const _default = AutoComplete;
export { _default as default };
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.object.assign.js";
import { useState, useRef, useEffect, createElement, Fragment } from "react";
var _domScrollIntoView = _interopRequireDefault(require("dom-scroll-into-view"));
var _trie = _interopRequireDefault(require("./trie"));
var _reactOutsideClickHandler = _interopRequireDefault(require("react-outside-click-handler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function AutoComplete(_ref) {
  let {
    list,
    showAll,
    clearOnSelect,
    inputProps,
    getPropValue,
    highlightFirstItem,
    highlightedItem,
    onSelect,
    wrapperDiv,
    listItemStyle,
    inputStyle,
    dropDownStyle
  } = _ref;
  const [isHighlighted, setIsHighlighted] = (0, useState)(0);
  const [suggestedWords, setSuggestedWords] = (0, useState)([]);
  const [listItems, setListItems] = (0, useState)([]);
  const trie = (0, useRef)();
  const inputRef = (0, useRef)();
  const dropDownRef = (0, useRef)();
  const itemsRef = (0, useRef)([]);
  (0, useEffect)(() => {
    let listItems;
    try {
      if (list) {
        if (list.some(value => {
          return typeof value == "object";
        })) {
          if (!getPropValue) {
            console.warn("getPropValue is needed to get property value");
            listItems = list;
          } else if (list) {
            listItems = list.map(getPropValue);
            if (listItems[0] == null) {
              listItems = list;
              console.warn("Check the getPropValue function - the property value doesn't seem to exist");
            }
          } else {
            console.warn("List prop is missing!");
          }
        } else {
          listItems = list;
        }
      } else {
        list = [];
      }
      setListItems(listItems);
    } catch (error) {
      throw Object.assign(new Error("Check the list prop - list must be an array"), {
        error: Error
      });
    }

    // If specified, set first item in dropdown to not be auto highlighted
    if (highlightFirstItem === false) {
      setIsHighlighted(-1);
    }

    // Initialize root node and store in ref.current
    trie.current = new _trie.default();

    // Insert each word into the data trie
    if (listItems) {
      for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];
        if (item) trie.current.insert(item);
      }
    }
  }, [list, getPropValue, highlightFirstItem, dropDownRef]);
  const handlePrefix = e => {
    if (!list) console.warn("You must pass a valid array to the list prop");
    const prefix = e.target.value;
    if (showAll && prefix.length === 0) {
      setSuggestedWords(listItems.sort());
      return;
    }
    if (prefix.length > 0) {
      setSuggestedWords(trie.current.find(e.target.value));
    } else {
      setSuggestedWords([]);
      if (highlightFirstItem === false) {
        setIsHighlighted(-1);
      } else {
        setIsHighlighted(0);
      }
    }
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0);
    }
  };
  const handleKeyDown = e => {
    if (e.keyCode === 40) {
      if (isHighlighted === suggestedWords.length - 1) {
        setIsHighlighted(0);
      }
      e.preventDefault();
      if (itemsRef.current[isHighlighted + 1]) {
        setIsHighlighted(isHighlighted + 1);
        (0, _domScrollIntoView.default)(itemsRef.current[isHighlighted + 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }
    if (e.keyCode === 38) {
      e.preventDefault();
      if (itemsRef.current[isHighlighted - 1]) {
        setIsHighlighted(isHighlighted - 1);
        (0, _domScrollIntoView.default)(itemsRef.current[isHighlighted - 1], dropDownRef.current, {
          onlyScrollIfNeeded: true
        });
      }
    }
    ;
    if (e.keyCode === 13) {
      if (list) {
        try {
          onSelect(suggestedWords[isHighlighted], list);
          if (clearOnSelect == null) {
            inputRef.current.value = "";
          } else {
            inputRef.current.value = suggestedWords[isHighlighted];
          }
        } catch (error) {
          throw Object.assign(new Error("You must provide a function to the onSelect prop"), {
            error: Error
          });
        } finally {
          setSuggestedWords([]);
          if (clearOnSelect == null) {
            inputRef.current.value = "";
          } else {
            if (!suggestedWords[isHighlighted]) {
              inputRef.current.value = "";
            } else {
              inputRef.current.value = suggestedWords[isHighlighted];
            }
          }
        }
      } else {
        try {
          onSelect(inputRef.current.value);
        } catch (error) {
          throw Object.assign(new Error("You must provide a function to the onSelect prop"), {
            error: Error
          });
        } finally {
          if (clearOnSelect == null) inputRef.current.value = "";
        }
      }
      ;
    }
  };
  const onMouseClick = suggestedWord => {
    setSuggestedWords([]);
    try {
      onSelect(suggestedWord, list);
      if (clearOnSelect == null) {
        inputRef.current.value = "";
      } else {
        inputRef.current.value = suggestedWord;
      }
    } catch (error) {
      throw Object.assign(new Error("You must provide a function to the onSelect prop"), {
        error: Error
      });
    } finally {
      if (clearOnSelect == null) {
        inputRef.current.value = "";
      } else {
        inputRef.current.value = suggestedWord;
      }
    }
  };
  const suggestedWordList = suggestedWords.map((suggestedWord, index) => {
    if (isHighlighted + 1 > suggestedWords.length) {
      setIsHighlighted(0);
    }
    if (suggestedWord) return /*#__PURE__*/createElement("div", {
      key: index,
      ref: el => itemsRef.current[index] = el,
      id: "suggested-word-".concat(index),
      style: isHighlighted === index ? _objectSpread(_objectSpread({}, highlightedItem), listItemStyle) : _objectSpread({}, listItemStyle),
      onClick: () => {
        onMouseClick(suggestedWord);
      },
      onMouseEnter: () => setIsHighlighted(index)
    }, suggestedWord);
  });
  return /*#__PURE__*/createElement(_reactOutsideClickHandler.default, {
    display: wrapperDiv ? wrapperDiv : 'block',
    onOutsideClick: () => {
      setSuggestedWords([]);
    }
  }, /*#__PURE__*/createElement("input", _extends({}, inputProps, {
    style: inputStyle,
    ref: inputRef,
    type: "text",
    onMouseDown: handlePrefix,
    onChange: handlePrefix,
    onKeyDown: handleKeyDown,
    onFocus: handlePrefix,
    autoComplete: "off"
  })), suggestedWordList.length ? /*#__PURE__*/createElement("div", {
    ref: dropDownRef,
    style: dropDownStyle
  }, suggestedWordList) : null);
}