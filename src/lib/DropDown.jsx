import { useRef, useEffect } from "react";

const DropDown = ({
    matchingItems,
    highlightedIndex,
    setHighlightedIndex,
    handleSelect,
    handleHighlight,
    resetInputValue,
    highlightedItemStyle,
    dropDownStyle,
    listItemStyle,
    controlSubmit,
    savedList
}) => {

    const dropDownRef = useRef()

    useEffect(() => {
        if (dropDownRef.current) {
            const highlighted = dropDownRef.current.querySelector(".highlighted-item")
            if (highlighted) {
                highlighted.scrollIntoView({ block: "nearest" })
            }
        }
    }, [highlightedIndex])

    const handleClick = (matchingItem) => {
        if (!controlSubmit) {
            try {
                handleSelect(savedList[matchingItem.originalIndex])
            } catch (error) {
                console.error("You must provide a valid function to the handleSelect prop", '\n', error)
            }
        }
        resetInputValue(matchingItem.value);
    }

    const onHighlight = (index) => {
        setHighlightedIndex(index)
        if (handleHighlight) {
            handleHighlight(savedList[matchingItems[index].originalIndex])
        }
    }

    return (
        <>
            <div
                className="dropdown-container"
                style={dropDownStyle}
                ref={dropDownRef}
            >
                {matchingItems.map((matchingItem, index) => (
                    <div
                        key={matchingItem.originalIndex}
                        className={highlightedIndex === index ? "dropdown-item highlighted-item" : "dropdown-item"}
                        style={highlightedIndex === index ? { ...highlightedItemStyle, ...listItemStyle } : { ...listItemStyle }}
                        onMouseEnter={() => onHighlight(index)}
                        onClick={() => { if (matchingItem.originalIndex > 0) { handleClick(matchingItem) } }}
                    >
                        {matchingItem.value}
                    </div>
                )
                )}
            </div>
        </>
    )
}

export default DropDown