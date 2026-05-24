import Anthropic from '@anthropic-ai/sdk'
import type { AIAssessmentRequest, AIAssessmentResponse, AICategoryScore } from '@/types/ai'
import type { CategoryKey } from '@/types/vendor'

function buildSystemPrompt(request: AIAssessmentRequest): string {
  const categoryGuides = request.categories
    .map(
      (cat) =>
        `### ${cat.label}\n${cat.description}\n- Low (1-4): ${cat.scoringGuide.low}\n- Mid (5-6): ${cat.scoringGuide.mid}\n- High (7-10): ${cat.scoringGuide.high}`,
    )
    .join('\n\n')

  return `You are an expert cybersecurity analyst specialising in SIEM (Security Information and Event Management) and XDR (Extended Detection and Response) market analysis. You have deep knowledge of enterprise security operations, vendor capabilities, pricing models, and deployment characteristics.

You are helping Sophos build a competitive intelligence tool. When assessing a vendor, provide honest, balanced, research-backed analysis. Do not fabricate specific pricing numbers — describe the pricing model and predictability qualitatively. Base your assessments on publicly available vendor documentation, analyst reports (Gartner, Forrester, IDC), and known industry characteristics as of your knowledge cutoff.

Score each category on a 1-10 scale:
- 1-3: Significant weaknesses, below market expectations
- 4-6: Adequate, meets basic requirements with notable gaps
- 7-8: Strong, above average with minor limitations
- 9-10: Best-in-class, market-leading capability

## Categories to Assess

${categoryGuides}

Call the submit_vendor_assessment tool with your complete assessment. Be specific and honest.`
}

function buildAssessmentTool(categories: AIAssessmentRequest['categories']) {
  const categoryProps: Record<string, object> = {}
  for (const cat of categories) {
    categoryProps[cat.id] = {
      type: 'object',
      required: ['score', 'rationale', 'highlights'],
      properties: {
        score: { type: 'number', minimum: 1, maximum: 10 },
        rationale: { type: 'string', description: '2-3 sentences explaining the score' },
        highlights: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
          description: 'Key strengths or weaknesses as bullet points',
        },
      },
    }
  }

  return {
    name: 'submit_vendor_assessment',
    description: 'Submit the complete vendor assessment with scores and rationale for all categories.',
    input_schema: {
      type: 'object' as const,
      required: [
        'vendorName', 'productName', 'description', 'scores',
        'tags', 'marketPosition', 'confidence', 'caveats',
      ],
      properties: {
        vendorName: { type: 'string' },
        productName: { type: 'string' },
        description: { type: 'string', description: '2-3 sentence vendor overview' },
        scores: {
          type: 'object',
          required: categories.map((c) => c.id),
          properties: categoryProps,
        },
        tags: { type: 'array', items: { type: 'string' } },
        marketPosition: {
          type: 'string',
          enum: ['Leader', 'Challenger', 'Niche', 'Visionary'],
        },
        confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        caveats: { type: 'string' },
      },
    },
  }
}

export async function generateVendorAssessment(
  request: AIAssessmentRequest,
  onStreamText: (text: string) => void,
  signal?: AbortSignal,
): Promise<AIAssessmentResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('No Anthropic API key configured. Set VITE_ANTHROPIC_API_KEY in your .env file.')

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const userPrompt = `Assess the following NG SIEM / security operations vendor:

Vendor: ${request.vendorName}
Product: ${request.productName}${request.additionalContext ? `\n\nAdditional context: ${request.additionalContext}` : ''}

Provide a balanced, honest assessment across all ${request.categories.length} categories. If you have limited information about this vendor, indicate lower confidence and note what you are uncertain about.`

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: buildSystemPrompt(request),
    tools: [buildAssessmentTool(request.categories)],
    tool_choice: { type: 'auto' },
    messages: [{ role: 'user', content: userPrompt }],
  })

  let toolInput = ''

  for await (const event of stream) {
    if (signal?.aborted) throw new Error('Cancelled')

    if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        onStreamText(event.delta.text)
      } else if (event.delta.type === 'input_json_delta') {
        toolInput += event.delta.partial_json
      }
    }
  }

  // Parse the tool use result
  const finalMessage = await stream.finalMessage()
  for (const block of finalMessage.content) {
    if (block.type === 'tool_use' && block.name === 'submit_vendor_assessment') {
      const raw = block.input as Record<string, unknown>
      const rawScores = raw.scores as Record<CategoryKey, AICategoryScore>

      return {
        vendorName: raw.vendorName as string,
        productName: raw.productName as string,
        description: raw.description as string,
        scores: rawScores,
        tags: raw.tags as string[],
        marketPosition: raw.marketPosition as AIAssessmentResponse['marketPosition'],
        confidence: raw.confidence as AIAssessmentResponse['confidence'],
        caveats: raw.caveats as string,
      }
    }
  }

  throw new Error('AI did not return a valid assessment. Please try again.')
}
