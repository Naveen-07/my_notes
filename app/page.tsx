"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  MoreHorizontal,
  Share,
  Zap,
  Sliders,
  Star,
  Users,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface Card {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const initialData: {
  columns: Record<string, Column>;
  columnOrder: string[];
} = {
  columns: {
    "col-1": {
      id: "col-1",
      title: "To Do",
      cards: [
        { id: "card-1", content: "bing ads tracking" },
        { id: "card-2", content: "business model for as service for offices" },
        { id: "card-3", content: "business model for culture setup" },
        { id: "card-4", content: "business model for ouse and grown up sale" },
        { id: "card-5", content: "ve upsell on site" },
        { id: "card-6", content: "e business model for marketing on shopify" },
      ],
    },
    "col-2": {
      id: "col-2",
      title: "Procurement To Do",
      cards: [
        { id: "card-7", content: "Find cheaper toys from china" },
        { id: "card-8", content: "Find cheaper plants in india" },
        { id: "card-9", content: "Figure out the cost of importing plants" },
        {
          id: "card-10",
          content:
            "What will it cost to make pot stands and metal stakes in house",
        },
        { id: "card-11", content: "Find a consultant for tissue culture lab" },
      ],
    },
    "col-3": {
      id: "col-3",
      title: "Operations",
      cards: [{ id: "card-12", content: "Reduce RTO Issues" }],
    },
    "col-4": {
      id: "col-4",
      title: "Test",
      cards: [],
    },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4"],
};

export default function KanbanBoard() {
  const [data, setData] = useState(initialData);
  const [isMounted, setIsMounted] = useState(false);

  // Header States
  const [isStarred, setIsStarred] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Addition & Edit States
  const [addingCardColId, setAddingCardColId] = useState<string | null>(null);
  const [newCardContent, setNewCardContent] = useState("");

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardText, setEditingCardText] = useState("");

  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColTitle, setEditingColTitle] = useState("");

  const [activeMenuColId, setActiveMenuColId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Drag & Drop Handlers ---
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newCards = Array.from(startColumn.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newColumn = { ...startColumn, cards: newCards };
      setData((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newColumn.id]: newColumn },
      }));
      return;
    }

    const startCards = Array.from(startColumn.cards);
    const [movedCard] = startCards.splice(source.index, 1);
    const newStart = { ...startColumn, cards: startCards };

    const finishCards = Array.from(finishColumn.cards);
    finishCards.splice(destination.index, 0, movedCard);
    const newFinish = { ...finishColumn, cards: finishCards };

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  // --- Card Handlers ---
  const handleAddCard = (columnId: string) => {
    if (!newCardContent.trim()) return;
    const newCard: Card = {
      id: `card-${Date.now()}`,
      content: newCardContent.trim(),
    };

    const targetCol = data.columns[columnId];
    const updatedCol = {
      ...targetCol,
      cards: [...targetCol.cards, newCard],
    };

    setData((prev) => ({
      ...prev,
      columns: { ...prev.columns, [columnId]: updatedCol },
    }));

    setNewCardContent("");
    setAddingCardColId(null);
  };

  const handleSaveCardEdit = (columnId: string, cardId: string) => {
    if (!editingCardText.trim()) return;
    const targetCol = data.columns[columnId];
    const updatedCards = targetCol.cards.map((c) =>
      c.id === cardId ? { ...c, content: editingCardText.trim() } : c
    );

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...targetCol, cards: updatedCards },
      },
    }));

    setEditingCardId(null);
    setEditingCardText("");
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    const targetCol = data.columns[columnId];
    const updatedCards = targetCol.cards.filter((c) => c.id !== cardId);

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: { ...targetCol, cards: updatedCards },
      },
    }));
  };

  // --- Column Handlers ---
  const handleAddColumn = () => {
    if (!newListTitle.trim()) return;
    const newColId = `col-${Date.now()}`;
    const newColumn: Column = {
      id: newColId,
      title: newListTitle.trim(),
      cards: [],
    };

    setData((prev) => ({
      columns: { ...prev.columns, [newColId]: newColumn },
      columnOrder: [...prev.columnOrder, newColId],
    }));

    setNewListTitle("");
    setIsAddingList(false);
  };

  const handleSaveColumnTitle = (columnId: string) => {
    if (!editingColTitle.trim()) return;
    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          title: editingColTitle.trim(),
        },
      },
    }));
    setEditingColId(null);
    setEditingColTitle("");
  };

  const handleDeleteColumn = (columnId: string) => {
    const newColumns = { ...data.columns };
    delete newColumns[columnId];
    const newOrder = data.columnOrder.filter((id) => id !== columnId);

    setData({
      columns: newColumns,
      columnOrder: newOrder,
    });
    setActiveMenuColId(null);
  };

  const handleShareBoard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2500);
  };

  if (!isMounted) return null;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center font-sans text-slate-800"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop')`,
      }}
    >
      {/* Toast Notification */}
      {showShareNotification && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          Board link copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-md text-white select-none">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-lg tracking-wide">To Do List</h1>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-medium flex items-center justify-center text-xs shadow-inner cursor-pointer hover:opacity-90">
            SG
          </div>
          <button
            title="Automation"
            onClick={() => alert("Automation rules triggered.")}
            className="hover:bg-white/10 p-1.5 rounded transition"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            title="Filters"
            onClick={() => alert("Filter panel opened.")}
            className="hover:bg-white/10 p-1.5 rounded transition"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            title="Favorite Board"
            onClick={() => setIsStarred(!isStarred)}
            className="hover:bg-white/10 p-1.5 rounded transition"
          >
            <Star
              className={`w-4 h-4 ${
                isStarred ? "text-amber-400 fill-amber-400" : ""
              }`}
            />
          </button>
          <button
            title="Members"
            onClick={() => alert("Members modal opened.")}
            className="hover:bg-white/10 p-1.5 rounded transition"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={handleShareBoard}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-white text-slate-800 font-medium px-3 py-1.5 rounded-md text-xs transition shadow"
          >
            <Share className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </header>

      {/* Main Board */}
      <main className="p-6 overflow-x-auto h-[calc(100vh-60px)]">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="flex items-start gap-4 h-full">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              if (!column) return null;

              return (
                <div
                  key={column.id}
                  className="w-72 flex-shrink-0 bg-white/70 backdrop-blur-md rounded-2xl p-3 shadow-lg flex flex-col max-h-full border border-white/20 relative"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 px-1">
                    {editingColId === column.id ? (
                      <div className="flex items-center gap-1 w-full mr-2">
                        <input
                          type="text"
                          value={editingColTitle}
                          onChange={(e) => setEditingColTitle(e.target.value)}
                          className="w-full text-sm font-semibold px-2 py-1 rounded border border-blue-400 outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveColumnTitle(column.id);
                            if (e.key === "Escape") setEditingColId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveColumnTitle(column.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2
                          onClick={() => {
                            setEditingColId(column.id);
                            setEditingColTitle(column.title);
                          }}
                          className="font-semibold text-slate-800 text-sm cursor-pointer hover:bg-black/5 px-1.5 py-0.5 rounded transition"
                          title="Click to edit list title"
                        >
                          {column.title}
                        </h2>
                        <span className="text-xs text-slate-500 font-medium bg-slate-200/60 px-1.5 py-0.5 rounded-full">
                          {column.cards.length}
                        </span>
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuColId(
                            activeMenuColId === column.id ? null : column.id
                          )
                        }
                        className="p-1 hover:bg-slate-200/50 rounded transition text-slate-600"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuColId === column.id && (
                        <div className="absolute right-0 top-7 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-30 py-1">
                          <button
                            onClick={() => handleDeleteColumn(column.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto space-y-2.5 min-h-[50px] pr-1 rounded-lg ${
                          snapshot.isDraggingOver ? "bg-slate-200/30" : ""
                        }`}
                      >
                        {column.cards.map((card, index) => (
                          <Draggable
                            key={card.id}
                            draggableId={card.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              const cardElement = (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                  className={`group bg-white p-3.5 rounded-xl border border-slate-100 text-sm font-normal text-slate-700 cursor-grab active:cursor-grabbing relative select-none ${
                                    snapshot.isDragging
                                      ? "shadow-2xl ring-2 ring-blue-500 rounded-xl"
                                      : "shadow-sm hover:shadow-md"
                                  }`}
                                >
                                  {editingCardId === card.id ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={editingCardText}
                                        onChange={(e) =>
                                          setEditingCardText(e.target.value)
                                        }
                                        className="w-full p-2 border border-blue-400 rounded-md text-xs focus:outline-none resize-none"
                                        rows={2}
                                        autoFocus
                                      />
                                      <div className="flex items-center gap-1 justify-end">
                                        <button
                                          onClick={() =>
                                            handleSaveCardEdit(
                                              column.id,
                                              card.id
                                            )
                                          }
                                          className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingCardId(null)}
                                          className="text-slate-500 text-xs px-2 py-1 hover:bg-slate-100 rounded"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-start justify-between gap-2">
                                      <span
                                        onClick={() => {
                                          setEditingCardId(card.id);
                                          setEditingCardText(card.content);
                                        }}
                                        className="flex-1 cursor-text leading-snug"
                                      >
                                        {card.content}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleDeleteCard(column.id, card.id)
                                        }
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-opacity"
                                        title="Delete card"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );

                              // Portal logic fixes offset caused by backdrop-blur
                              if (snapshot.isDragging) {
                                return ReactDOM.createPortal(
                                  cardElement,
                                  document.body
                                );
                              }

                              return cardElement;
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Add New Card Section */}
                  <div className="mt-3 pt-2 border-t border-slate-200/50">
                    {addingCardColId === column.id ? (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Enter card details..."
                          value={newCardContent}
                          onChange={(e) => setNewCardContent(e.target.value)}
                          className="w-full p-2 rounded-lg border border-blue-400 text-xs focus:outline-none bg-white shadow-inner resize-none"
                          rows={2}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddCard(column.id);
                            }
                          }}
                        />
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleAddCard(column.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition shadow"
                          >
                            Add card
                          </button>
                          <button
                            onClick={() => {
                              setAddingCardColId(null);
                              setNewCardContent("");
                            }}
                            className="p-1 hover:bg-slate-200/60 rounded text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingCardColId(column.id)}
                        className="flex items-center gap-2 hover:bg-slate-200/50 px-2 py-1 rounded transition text-xs font-medium w-full text-left text-slate-600"
                      >
                        <Plus className="w-4 h-4" /> Add a card
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add List Section */}
            <div className="w-72 flex-shrink-0">
              {isAddingList ? (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/30 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-medium border border-blue-400 rounded-lg outline-none bg-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setIsAddingList(false);
                    }}
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleAddColumn}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
                    >
                      Add list
                    </button>
                    <button
                      onClick={() => setIsAddingList(false)}
                      className="p-1 hover:bg-slate-200/60 rounded text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-3 text-white font-medium text-sm flex items-center gap-2 transition border border-white/10 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add another list
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}