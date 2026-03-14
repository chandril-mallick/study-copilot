import React, { useState } from "react";

// shadcn/ui components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  FileText,
  Download,
  Copy,
  Bot,
  ScrollText,
  ShieldCheck,
  Megaphone,
  Sparkles
} from "lucide-react";

// PDF
import { jsPDF } from "jspdf";

// API service
import { adminService } from "../../../services/adminService";

const AIPolicyGenerator = () => {
  const [topic, setTopic] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  // ----------------------------
  // Copy Content
  // ----------------------------
  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(
      `${generatedContent.title}\n\n${generatedContent.body}`
    );
  };

  // ----------------------------
  // Download PDF
  // ----------------------------
  const handleDownloadPDF = () => {
    if (!generatedContent) return;

    const doc = new jsPDF();
    doc.setFont("times", "normal");

    doc.setFontSize(22);
    doc.text(generatedContent.title, 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Date: ${generatedContent.date}`, 190, 30, { align: "right" });

    const pageWidth = 190;
    const splitBody = doc.splitTextToSize(generatedContent.body, pageWidth);

    doc.setFontSize(12);
    let currentY = 50;

    if (selectedTemplate?.id === "notice") {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("NOTICE", 105, 42, { align: "center" });
        
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        doc.text("Ref No: BWU/NOT/2026/AI-GEN", 10, 30);
        
        currentY = 60; // Push body down for notices
    }

    doc.setFontSize(12);
    doc.text(splitBody, 10, currentY, { maxWidth: pageWidth });

    // Signature
    doc.line(140, 270, 190, 270);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Registrar", 165, 275, { align: "center" });
    doc.text("Brainware University", 165, 280, { align: "center" });

    doc.save(`${topic.replace(/\s+/g, "_")}_Draft.pdf`);
  };

  // ----------------------------
  // Templates
  // ----------------------------
  const templates = [
    {
      id: "circular",
      label: "Official Circular",
      icon: Megaphone,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      id: "regulation",
      label: "Academic Regulation",
      icon: ScrollText,
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      id: "compliance",
      label: "Compliance Draft",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-600"
    },
    {
      id: "notice",
      label: "Official Institution Notice",
      icon: FileText,
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  // ----------------------------
  // Generate Content
  // ----------------------------
  const handleGenerate = async () => {
    if (!topic || !selectedTemplate) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const result = await adminService.generatePolicy(
        topic,
        selectedTemplate.id
      );

      if (result?.success && result?.content) {
        setGeneratedContent(result.content);
      } else {
        alert("Failed to generate policy content.");
      }
    } catch (error) {
      console.error("Policy generation failed:", error);
      alert("Error: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-4 md:p-6 flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Bot className="w-8 h-8 text-pink-600" />
          AI Policy Generator
        </h2>
        <p className="text-gray-500">
          Auto-draft circulars, regulations, and compliance documents in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

        {/* LEFT PANEL */}
        <Card className="lg:col-span-5 flex flex-col bg-white dark:bg-zinc-900 border border-pink-500/20 shadow-lg">
          <CardContent className="p-6 flex flex-col gap-6 h-full">

            {/* Step 1 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                1. Select Document Type
              </h3>

              <div className="space-y-3">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all
                      ${
                        selectedTemplate?.id === t.id
                          ? "border-pink-500 bg-pink-500/10 ring-1 ring-pink-500/30"
                          : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${t.color}`}>
                      <t.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{t.label}</span>
                    {selectedTemplate?.id === t.id && (
                      <Badge className="ml-auto bg-pink-500 text-white text-[10px]">
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                2. Enter Topic / Subject
              </h3>
              <Input
                placeholder="e.g. New Attendance Policy for 2024"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12"
              />
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim() || !selectedTemplate || isGenerating}
                className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating Draft…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Document
                  </span>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* RIGHT PANEL */}
        <Card className="lg:col-span-7 bg-gray-50 flex flex-col relative overflow-hidden border shadow-inner">

          {/* Empty State */}
          {!generatedContent && !isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center">
              <FileText className="w-20 h-20 mb-4 text-gray-300" />
              <h3 className="text-xl font-bold">Ready to Draft</h3>
              <p>Select a template and enter a topic</p>
            </div>
          )}

          {/* Loading (NO BLUR, NO OPACITY) */}
          {isGenerating && !generatedContent && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4" />
              <p className="text-pink-600 font-medium">
                Drafting content with AI…
              </p>
            </div>
          )}

          {/* Result */}
          {generatedContent && (
            <div className="flex-1 bg-white m-4 rounded-lg shadow border overflow-hidden">

              <div className="bg-gray-50 border-b p-3 flex justify-between items-center sticky top-0 z-10">
                <span className="text-xs font-mono text-gray-500">
                  Draft_v1.0 • {generatedContent.date}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-1" /> PDF
                  </Button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto font-serif whitespace-pre-line leading-7 text-[15px] opacity-100 text-gray-900">
                <h1 className="text-2xl font-bold text-center mb-2 uppercase underline">
                  {generatedContent.title}
                </h1>

                {selectedTemplate?.id === "notice" && (
                  <div className="text-center mb-8">
                    <div className="text-xs text-gray-500 mb-2 font-sans text-left">Ref No: BWU/NOT/2026/AI-GEN</div>
                    <div className="text-xl font-bold font-sans tracking-widest border-y border-gray-200 py-1">NOTICE</div>
                  </div>
                )}

                {generatedContent.body}

                <div className="mt-12 pt-8 border-t flex justify-end">
                  <div className="text-center w-40">
                    <div className="h-12" />
                    <div className="border-t pt-1 font-bold text-sm">
                      Registrar
                    </div>
                    <div className="text-xs text-gray-500">
                      Brainware University
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIPolicyGenerator;
