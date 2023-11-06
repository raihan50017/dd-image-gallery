import { useEffect, useRef, useState } from "react";
function Gallery() {
  //Basic variable setup
  const [numOfImageSlots, setNumOfImageSlots] = useState(12);
  const [numOfImagesPerRow, setNumOfImagesPerRow] = useState(5);
  const [imageSlots, setImageSlots] = useState({ slots: [] });
  const [selectedImageElement, setSelectedImageElement] = useState({
    element: null,
  });
  const [originalImageSlot, setOriginalImageSlot] = useState({ slot: null });
  const [originalClickCoords, setOriginalClickCoords] = useState({
    cords: null,
  });
  const [lastTouchedSlotId, setLastTouchedSlotId] = useState({ id: "" });
  const [deleteCount, setDeteCount] = useState(0);

  const [deviceWidth, setDeviceWidth] = useState(null);
  const [itemWidth, setItemWidth] = useState(null);
  const [itemHeight, setItemHeight] = useState(null);
  const [wrapperLeft, setWrapperLeft] = useState(null);
  const [wrapperTop, setWrapperTop] = useState(null);
  const [selectedItems, setSelectedItems] = useState({ count: 0, ids: [] });

  //Reference variable setup
  const ddSlot = useRef(null);
  const dragDrop = useRef(null);
  const main = useRef(null);

  //Image library setup
  const [imageLibrary, setImageLibrary] = useState([
    { id: 23, image: "image-1.webp", selected: false },
    { id: 42, image: "image-2.webp", selected: false },
    { id: 5567, image: "image-3.webp", selected: false },
    { id: 57, image: "image-4.webp", selected: false },
    { id: 28, image: "image-5.webp", selected: false },
    { id: 879, image: "image-6.webp", selected: false },
    { id: 10, image: "image-7.webp", selected: false },
    { id: 50, image: "image-8.webp", selected: false },
    { id: 70, image: "image-9.webp", selected: false },
    { id: 80, image: "image-10.jpeg", selected: false },
    { id: 900, image: "image-11.jpeg", selected: false },
  ]);

  //Image serial list
  const [listedImageIds, setListedImageIds] = useState({
    lists: [23, 42, 5567, 57, 28, 879, 10, 50, 70, 80, 900],
  });

  useEffect(() => {
    setDeviceWidth(main.current.offsetWidth);
    if (main.current.offsetWidth <= 991 && main.current.offsetWidth >= 768) {
      setNumOfImagesPerRow(4);
    } else if (main.current.offsetWidth < 768) {
      setNumOfImagesPerRow(2);
    }
    setItemWidth(ddSlot.current.offsetWidth);
    setItemHeight(ddSlot.current.offsetHeight);
    setWrapperLeft(dragDrop.current.offsetLeft);
    setWrapperTop(dragDrop.current.offsetTop);
  }, [ddSlot, dragDrop, main, deviceWidth]);

  //Select item for delete
  const handleSelect = (imageId) => {
    const objIndex = imageLibrary.findIndex((obj) => obj.id == imageId);
    if (imageLibrary[objIndex]?.selected) {
      imageLibrary[objIndex].selected = false;
      const newIds = selectedItems.ids.filter(function (id) {
        return id != imageId;
      });
      setSelectedItems({
        count: selectedItems.count - 1,
        ids: newIds,
      });
    } else {
      imageLibrary[objIndex].selected = true;
      const newIds = selectedItems.ids;
      newIds.push(imageId);
      setSelectedItems({
        count: selectedItems.count + 1,
        ids: newIds,
      });
    }
  };

  const handleDelete = () => {
    const newList = listedImageIds.lists.filter(function (id) {
      return selectedItems.ids.indexOf(id) < 0;
    });
    setNumOfImageSlots((value) => value - selectedItems.ids.length);
    setListedImageIds({ ...listedImageIds, lists: newList });
    setSelectedItems({ count: 0, ids: [] });
    arrangeItems();
  };

  //Generate image slot
  const addImageSlots = () => {
    const iamgeSlotList = [];
    var i = 0,
      len = numOfImageSlots;

    const featureSlotWidth = (2 * 100) / numOfImagesPerRow;
    const featureSlotHeight = (2 * 100) / numOfImagesPerRow;

    const slotWidth = 100 / numOfImagesPerRow;
    const slotHeight = 100 / numOfImagesPerRow;

    iamgeSlotList.push(
      <div
        key={numOfImageSlots + i}
        ref={ddSlot}
        className="dd-slot outline-show"
        style={{
          width: featureSlotWidth + "%",
          paddingBottom: featureSlotHeight + "%",
        }}
      ></div>
    );

    for (; i < len - 1; i++) {
      iamgeSlotList.push(
        <div
          key={numOfImageSlots + i + 1}
          ref={ddSlot}
          className="dd-slot"
          style={{
            width: slotWidth + "%",
            paddingBottom: slotHeight + "%",
          }}
        ></div>
      );
    }
    return iamgeSlotList;
  };

  //Add image to each slot
  const drawImages = () => {
    const drawImagesList = [];
    const slots = [];

    var i = 1,
      j = 0,
      len = numOfImageSlots;
    var itemX, itemY;
    var imageId, image;

    imageId = listedImageIds?.lists[0] || -1;
    image = getImageById(imageId);
    itemX = 0;
    itemY = 0;

    const selectedId = imageId;

    drawImagesList.push(
      <div
        key={imageId}
        onMouseDown={imageMousedown}
        onMouseUp={imageMouseup}
        className={`dd-item dd-transition ${imageId < 0 ? " dd-disabled" : ""}`}
        data-image-id={imageId}
        style={{
          width: itemWidth * 2 + "px",
          height: itemHeight * 2 + "px",
          transform: "translate3d(" + itemX + "px," + itemY + "px,0)",
        }}
      >
        <div
          className="dd-item-inner dd-shadow"
          style={{
            backgroundImage: "url(images/" + image?.image + ")",
            height: "100%",
            width: "100%",
          }}
        >
          {image?.selected ? (
            <div className="dd-selected-inner">
              <input
                onClick={() => handleSelect(selectedId)}
                value="1"
                type="checkbox"
                checked
              />
            </div>
          ) : (
            <div className="dd-selector-inner">
              <input
                value="1"
                onClick={() => handleSelect(selectedId)}
                type="checkbox"
              />
            </div>
          )}
        </div>
      </div>
    );

    slots[0] = {
      width: itemWidth * 2,
      height: itemHeight * 2,
      x: itemX,
      y: itemY,
    };

    while (i < len) {
      j++;
      if (
        (j % numOfImagesPerRow == 0 &&
          (Math.floor(j / numOfImagesPerRow) == 0 ||
            Math.floor(j / numOfImagesPerRow) == 1)) ||
        (j % numOfImagesPerRow == 1 &&
          (Math.floor(j / numOfImagesPerRow) == 0 ||
            Math.floor(j / numOfImagesPerRow) == 1))
      ) {
        continue;
      }
      imageId = listedImageIds?.lists[i] || -1;
      image = getImageById(imageId);
      itemX = (j % numOfImagesPerRow) * itemWidth;
      itemY = Math.floor(j / numOfImagesPerRow) * itemHeight;

      const selectedId = imageId;

      drawImagesList.push(
        <div
          key={imageId}
          onMouseDown={imageMousedown}
          onMouseUp={imageMouseup}
          className={`dd-item dd-transition ${
            imageId < 0 ? " dd-disabled" : ""
          }`}
          data-image-id={imageId}
          style={{
            width: itemWidth + "px",
            height: itemHeight + "px",
            transform: "translate3d(" + itemX + "px," + itemY + "px,0)",
          }}
        >
          <div
            className="dd-item-inner dd-shadow"
            style={{
              backgroundImage: "url(images/" + image?.image + ")",
              height: "100%",
              width: "100%",
            }}
          >
            {image?.selected ? (
              <div className="dd-selected-inner">
                <input
                  onClick={() => handleSelect(selectedId)}
                  value="1"
                  type="checkbox"
                  checked
                />
              </div>
            ) : (
              <div className="dd-selector-inner">
                <input
                  value="1"
                  onClick={() => handleSelect(selectedId)}
                  type="checkbox"
                />
              </div>
            )}
          </div>
        </div>
      );
      slots[i] = {
        width: itemWidth,
        height: itemHeight,
        x: itemX,
        y: itemY,
      };
      i++;
    }
    imageSlots.slots = slots;
    return drawImagesList;
  };

  //Execute this function while dragging mouse on an image
  const imageMousedown = (event) => {
    if (!selectedImageElement?.element) {
      selectedImageElement.element = event.currentTarget;
      originalImageSlot.slot = getIndexOfImageId(
        event.currentTarget.getAttribute("data-image-id")
      );
      originalClickCoords.cords = { x: event.pageX, y: event.pageY };

      selectedImageElement?.element?.classList.add("dd-selected");
      selectedImageElement?.element?.classList.remove("dd-transition");
    }
  };

  //Execute this function while dragging mouse up from image
  const imageMouseup = () => {
    selectedImageElement?.element?.classList.remove("dd-selected");
    selectedImageElement?.element?.classList.add("dd-transition");

    arrangeItems();

    selectedImageElement.element = null;
    originalClickCoords.cords = null;
    originalImageSlot.slot = null;
  };

  //Execute this function while moving mouse on an image
  const imageMousemove = (event) => {
    if (selectedImageElement?.element) {
      var pageX = event.pageX,
        pageY = event.pageY;

      var clickX = pageX - wrapperLeft,
        clickY = pageY - wrapperTop,
        hoverSlotId = getSlotIdByCoords({ x: clickX, y: clickY });

      var ele = selectedImageElement?.element,
        imageId = ele.getAttribute("data-image-id"),
        index = originalImageSlot?.slot,
        newIndex = getIndexOfImageId(imageId),
        x = imageSlots?.slots[index]?.x,
        y = imageSlots?.slots[index]?.y;

      var resultX = x + (pageX - originalClickCoords?.cords?.x),
        resultY = y + (pageY - originalClickCoords?.cords?.y);

      if (hoverSlotId != undefined && lastTouchedSlotId?.id != hoverSlotId) {
        lastTouchedSlotId.id = hoverSlotId;

        const lists = listedImageIds?.lists;

        lists?.splice(hoverSlotId, 0, lists?.splice(newIndex, 1)[0]);

        listedImageIds.lists = lists;

        arrangeItems();
      }

      if (clickX - resultX > itemWidth) {
        resultX = clickX - itemWidth + itemWidth / 2;
      }
      if (clickY - resultY > itemHeight) {
        resultY = clickY - itemHeight + itemHeight / 2;
      }
      ele.style.transform =
        "translate3d(" + resultX + "px," + resultY + "px,0)";
    }
  };

  const getImageById = (id) => {
    return imageLibrary.find(function (image) {
      return image.id == id;
    });
  };

  const getIndexOfImageId = (id) => {
    var i = 0,
      len = listedImageIds?.lists?.length;

    for (; i < len; i++) if (listedImageIds?.lists[i] == id) return i;
  };

  const getSlotIdByCoords = (coords) => {
    // Get the current slot being hovered over
    for (var id in imageSlots?.slots) {
      var slot = imageSlots?.slots[id];

      if (
        slot.x <= coords.x &&
        coords.x <= slot.x + slot.width &&
        slot.y <= coords.y &&
        coords.y <= slot.y + slot.height
      )
        return id;
    }
  };

  const arrangeItems = () => {
    var i = 0,
      len = listedImageIds?.lists?.length,
      slot,
      ele;

    for (; i < len; i++) {
      slot = imageSlots?.slots[i];
      ele = dragDrop.current.querySelector(
        '[data-image-id="' + listedImageIds?.lists[i] + '"]'
      );

      if (i != 0) {
        ele.style.width = itemWidth + "px";
        ele.style.height = itemHeight + "px";
      } else {
        ele.style.width = itemWidth * 2 + "px";
        ele.style.height = itemHeight * 2 + "px";
      }
      ele.style.transform = "translate3d(" + slot.x + "px," + slot.y + "px,0)";
    }
  };

  return (
    <>
      <div ref={main}>
        <div className="dd-banner">
          {selectedItems.count == 0 ? (
            <h3>Image Gallery</h3>
          ) : (
            <h3>Selected Items: {selectedItems?.count}</h3>
          )}
          {selectedItems.count == 0 ? (
            <h3></h3>
          ) : (
            <h3 onClick={handleDelete} className="delete">
              Delete
            </h3>
          )}
        </div>
        <div id="dragDrop" ref={dragDrop} onMouseMove={imageMousemove}>
          {addImageSlots()}
          {drawImages()}
        </div>
      </div>
    </>
  );
}
export default Gallery;
