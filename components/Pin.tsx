import React from 'react';
import { PinContainer } from '@/components/ui/3d-pin';

export function AnimatedPinDemo() {
  return (
    <div className=" bg-black p-4 my-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {/* Box 1 */}
          <div className="h-[400px] relative">
            <PinContainer title="Document Maker" href="https://example.com/document-maker">
              <div className="flex basis-full flex-col tracking-tight text-slate-100/50 w-[20rem] h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  Document Maker
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-400">
                    Craft well-structured and professionally formatted documents with precise perfection
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                  <img
                    src="https://static-blog.onlyoffice.com/wp-content/uploads/2022/07/Blog_10popular_documents.jpg"
                    alt="Document Maker"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </PinContainer>
          </div>

          {/* Box 2 */}
          <div className="h-[400px] relative">
            <PinContainer title="Video Maker" href="https://example.com/video-maker">
              <div className="flex basis-full flex-col tracking-tight text-slate-100/50 w-[20rem] h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  Video Maker
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-400">
                    Create high-quality, engaging, and dynamic multimedia content with Meteor AI
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                  <img
                    src="https://blog.coursify.me/wp-content/uploads/2021/10/creating-videos-coursifyme.jpg"
                    alt="Video Maker"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </PinContainer>
          </div>

          {/* Box 3 */}
          <div className="h-[400px] relative md:col-span-2 lg:col-span-1">
            <PinContainer title="PPT Maker" href="https://example.com/ppt-maker">
              <div className="flex basis-full flex-col tracking-tight text-slate-100/50 w-[20rem] h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  PPT Maker
                </h3>
                <div className="text-base !m-0 !p-0 font-normal">
                  <span className="text-slate-400">
                    Design visually stunning presentations with AI brilliance
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
                  <img
                    src="https://www.inkppt.com/guides/content/images/2024/04/Techniques-for-Seamless-Flow-Between-Slides.jpg"
                    alt="PPT Maker"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </PinContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
