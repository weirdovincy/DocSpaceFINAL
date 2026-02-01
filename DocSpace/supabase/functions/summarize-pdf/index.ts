import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfText, fileName } = await req.json();

    if (!pdfText || pdfText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No PDF text provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate text if too long (keep first ~15000 chars for context window)
    const truncatedText = pdfText.length > 15000 
      ? pdfText.substring(0, 15000) + "\n\n[Content truncated due to length...]"
      : pdfText;

    const systemPrompt = `You are an expert academic content summarizer. Your task is to create clear, comprehensive summaries of academic documents.

When summarizing, you should:
1. Identify the main topic and key concepts
2. Extract the most important points and arguments
3. Note any formulas, definitions, or key terms
4. Preserve the logical flow of the content
5. Keep the summary concise but informative (aim for 200-400 words)

Format your response as:
## Overview
[Brief 1-2 sentence overview]

## Key Points
- [Point 1]
- [Point 2]
- [Point 3]
...

## Important Concepts
[List any key terms, formulas, or definitions]

## Summary
[Detailed summary paragraph]`;

    const userPrompt = `Please summarize the following academic document${fileName ? ` titled "${fileName}"` : ""}:

---
${truncatedText}
---

Provide a structured summary following the format specified.`;

    console.log("Calling Lovable AI Gateway for summarization...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate summary" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      console.error("No summary in response:", data);
      return new Response(
        JSON.stringify({ error: "No summary generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Summary generated successfully");

    return new Response(
      JSON.stringify({ 
        summary,
        generatedAt: new Date().toISOString(),
        model: "Gemini AI"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in summarize-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
