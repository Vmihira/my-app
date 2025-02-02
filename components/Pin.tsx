"use client";
import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";

export function AnimatedPinDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-8 px-10">
        {/* Box 1 */}
        <PinContainer title="/ui.aceternity.com" href="https://twitter.com/mannupaaji">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">Document Maker</h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-400 ">Craft well-structured and professionally formatted documents with precise perfection</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <img src="https://static-blog.onlyoffice.com/wp-content/uploads/2022/07/Blog_10popular_documents.jpg" alt="Demo image" className="w-full h-full object-cover" />
          </div>
        </div>
      </PinContainer>

        {/* Box 2 */}
        <PinContainer title="/ui.aceternity.com" href="https://twitter.com/mannupaaji">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">Video Maker</h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-400 ">Create high-quality, engaging, and dynamic multimedia content with Meteor AI</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <img src="https://blog.coursify.me/wp-content/uploads/2021/10/creating-videos-coursifyme.jpg" alt="Demo image" className="w-full h-full object-cover" />
          </div>
        </div>
      </PinContainer>

        {/* Box 3 */}
        <PinContainer title="/ui.aceternity.com" href="https://twitter.com/mannupaaji">
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">PPT Maker</h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-400 ">Design visually stunning presentations with AI brilliance.</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <img src="https://www.inkppt.com/guides/content/images/2024/04/Techniques-for-Seamless-Flow-Between-Slides.jpg" alt="Demo image" className="w-full h-full object-cover" />
          </div>
        </div>
      </PinContainer>
      </div>
    </div>
  );
}
