"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play, Pause, ChevronLeft, CheckCircle2,
  Lock, Clock, MessageSquare, Download,
  Maximize, Volume2, Settings, SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockCourse = {
  title: "Piano Fundamentals",
  slug: "piano-fundamentals",
  instructor: "Yonas Befekadu",
  totalLessons: 8,
  sections: [
    {
      title: "Getting Started",
      lessons: [
        { id: "1", title: "Welcome & Course Overview", duration: "5:30", isFree: true, completed: true },
        { id: "2", title: "Understanding the Piano Layout", duration: "12:45", isFree: true, completed: true },
      ],
    },
    {
      title: "Basic Notes & Posture",
      lessons: [
        { id: "3", title: "Proper Sitting Posture", duration: "8:20", isFree: false, completed: true },
        { id: "4", title: "Middle C and Basic Notes", duration: "15:10", isFree: false, completed: false },
        { id: "5", title: "Reading Sheet Music Basics", duration: "18:30", isFree: false, completed: false },
      ],
    },
    {
      title: "First Songs",
      lessons: [
        { id: "6", title: "Mary Had a Little Lamb", duration: "10:15", isFree: false, completed: false },
        { id: "7", title: "Ode to Joy - Simple Version", duration: "14:20", isFree: false, completed: false },
        { id: "8", title: "Practice Tips & Next Steps", duration: "7:45", isFree: false, completed: false },
      ],
    },
  ],
};

export default function CoursePlayerPage() {
  const [currentLessonId, setCurrentLessonId] = useState("4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(35);
  const [activeTab, setActiveTab] = useState<"lessons" | "notes" | "discussion">("lessons");

  const allLessons = mockCourse.sections.flatMap((s) => s.lessons);
  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const totalLessons = allLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/courses/${mockCourse.slug}`}
            className="flex items-center gap-2 text-warm-white/50 hover:text-warm-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Course</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <span className="hidden sm:block text-sm text-warm-white/70">{mockCourse.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-warm-white/40">
            {completedCount}/{totalLessons} completed
          </span>
          <div className="w-24 h-1.5 rounded-full bg-surface-light overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black aspect-video w-full max-h-[70vh] flex items-center justify-center">
            {/* Placeholder gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-surface to-gold/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gold/30">
                  <Play className="w-10 h-10 text-gold ml-1" />
                </div>
                <p className="text-warm-white/60 text-sm">{currentLesson.title}</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="group mb-3 cursor-pointer">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
                  <div
                    className="h-full bg-gold rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-warm-white hover:text-gold transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button className="text-warm-white/60 hover:text-warm-white transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-warm-white/60" />
                    <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-warm-white/60 rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <span className="text-xs text-warm-white/50">
                    2:45 / {currentLesson.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-warm-white/60 hover:text-warm-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="text-warm-white/60 hover:text-warm-white transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-warm-white font-[family-name:var(--font-playfair)]">
                  {currentLesson.title}
                </h1>
                <p className="text-sm text-warm-white/40 mt-1">
                  Lesson {currentIndex + 1} of {totalLessons} &middot; by {mockCourse.instructor}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Download className="w-3.5 h-3.5" /> Resources
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Ask Question
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between p-4">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => currentIndex > 0 && setCurrentLessonId(allLessons[currentIndex - 1].id)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous Lesson
            </Button>
            <Button
              variant={currentLesson.completed ? "outline" : "primary"}
              onClick={() => {
                if (!currentLesson.completed) {
                  // Mark as completed
                } else if (currentIndex < totalLessons - 1) {
                  setCurrentLessonId(allLessons[currentIndex + 1].id);
                }
              }}
            >
              {currentLesson.completed
                ? currentIndex < totalLessons - 1
                  ? "Next Lesson" 
                  : "Course Complete!"
                : "Mark as Complete"
              }
              {!currentLesson.completed && <CheckCircle2 className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Sidebar — Lessons List */}
        <div className="w-80 lg:w-96 border-l border-border bg-surface flex flex-col">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-border">
            {(["lessons", "notes", "discussion"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-xs font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "text-gold border-b-2 border-gold"
                    : "text-warm-white/40 hover:text-warm-white/60"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Lessons List */}
          {activeTab === "lessons" && (
            <div className="flex-1 overflow-y-auto">
              {mockCourse.sections.map((section, sIdx) => (
                <div key={sIdx}>
                  <div className="px-4 py-2.5 bg-surface-light/50 border-b border-border/50">
                    <p className="text-xs font-medium text-warm-white/50 uppercase tracking-wider">
                      Section {sIdx + 1}: {section.title}
                    </p>
                  </div>
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonId(lesson.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 border-b border-border/30 transition-colors flex items-center gap-3",
                          isActive
                            ? "bg-gold/5 border-l-2 border-l-gold"
                            : "hover:bg-surface-light/30"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs",
                          lesson.completed
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isActive
                              ? "bg-gold/20 text-gold"
                              : "bg-surface-light text-warm-white/30"
                        )}>
                          {lesson.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : lesson.isFree || allLessons.findIndex((l) => l.id === lesson.id) <= currentIndex ? (
                            <span>{lesson.id}</span>
                          ) : (
                            <Lock className="w-3 h-3" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "text-sm truncate",
                            isActive ? "text-gold font-medium" : "text-warm-white/70"
                          )}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-warm-white/30" />
                            <span className="text-[11px] text-warm-white/30">{lesson.duration}</span>
                            {lesson.isFree && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="flex-1 p-4">
              <textarea
                placeholder="Add your notes for this lesson..."
                className="w-full h-full min-h-[300px] rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              />
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === "discussion" && (
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-10 h-10 text-warm-white/10 mb-3" />
              <p className="text-sm text-warm-white/30 mb-1">No discussions yet</p>
              <p className="text-xs text-warm-white/20">Be the first to ask a question about this lesson</p>
              <Button variant="outline" size="sm" className="mt-4">
                Start Discussion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
