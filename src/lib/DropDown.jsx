import { useRef, useEffect } from "react";

const DropDown = ({
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    onSelect,
    onHighlightChange,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    controlSubmit,
    savedList
}) => {

    const dropDownRef = useRef();

    useEffect(() => {
        if (dropDownRef.current) {
            const highlighted = dropDownRef.current.querySelector(".highlighted-item");
            if (highlighted) {
                highlighted.scrollIntoView({ block: "nearest" })
            };
        };
    }, [highlightedIndex]);

    const handleClick = (matchingItem) => {
        if (!controlSubmit) {
            onSelect(savedList[matchingItem.originalIndex])
        };
        resetInputValue(matchingItem.value);
    };

    const handleHighlight = (index) => {
        setHighlightedIndex(index)
        if (onHighlightChange && matchingItems[index].originalIndex >= 0) {
            onHighlightChange(savedList[matchingItems[index].originalIndex])
        };
    };

    return (
        <>
            <div
                data-testid="dropDown"
                className="dropdown-container"
                style={dropDownStyle}
                ref={dropDownRef}
            >
                {matchingItems.map((matchingItem, index) => (
                    <div
                        key={matchingItem.originalIndex}
                        className={highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item"}
                        style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
                        onMouseEnter={() => handleHighlight(index)}
                        onClick={() => { if (matchingItem.originalIndex >= 0) { handleClick(matchingItem) } }}
                    >
                        {matchingItem.value}
                    </div>
                )
                )}
            </div>
        </>
    )
};

export default DropDown