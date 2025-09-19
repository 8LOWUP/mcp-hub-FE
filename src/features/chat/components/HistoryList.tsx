"use client";

import { useState } from "react";
import HistoryCard from "./HistoryCard";

type HistoryItem = {
  id: string;
  title: string;
  preview?: string;
  time?: string;
};

const dummyHistories: HistoryItem[] = [
  { id: "1", title: "Notion에선 일정 추가하기", preview: "노션에 “저녁먹기” 일정을 추가합니다" },
  { id: "2", title: "Notion에선 일정 추가하기", preview: "노션에 “점심먹기” 일정을 추가합니다" },
  { id: "3", title: "Notion에선 일정 추가하기", preview: "노션에 “아침먹기” 일정을 추가합니다" },
];

const HistoryList = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
        <h2 className="text-2xl font-bold">History</h2>
        <ul className="flex flex-col w-full h-full overflow-y-auto">
          {dummyHistories.map((item) => (
            <li key={item.id}>
              <HistoryCard
                title={item.title}
                description={item.preview}
                selected={selectedId === item.id}
                onClick={() => setSelectedId(item.id)}
                onMenuClick={() => console.log("menu clicked for", item.id)}
              />
            </li>
          ))}
      </ul>
    </>
  );
};

export default HistoryList;