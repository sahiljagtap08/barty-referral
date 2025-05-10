# Contact API Integration

This document explains how to set up and integrate the external APIs used for the contact lookup feature in the Barty application.

## Overview

The contact lookup API allows users to find relevant contacts (recruiters and employees) at companies where they're applying for jobs. This significantly enhances the referral experience by providing real contact suggestions rather than requiring manual research.

Our implementation uses a multi-tiered approach:

1. **Database Cache**: First check if we already have contacts for the requested company
2. **Clearbit API**: For company information and domain verification
3. **People Data Labs (PDL)**: For finding actual employees and their contact details
4. **Fallback Generator**: When APIs fail or aren't configured, we generate realistic mock data

## Required API Keys

You'll need to set up the following API keys in your `.env.local` file:

```
# Contact lookup APIs
CLEARBIT_API_KEY=your_clearbit_api_key
PDL_API_KEY=your_people_data_labs_api_key
```

## Setting Up Clearbit

[Clearbit](https://clearbit.com/) provides company data and enrichment services.

1. Sign up for a Clearbit account at https://clearbit.com/
2. Navigate to your dashboard and obtain your API key
3. Add the API key to your `.env.local` file as `CLEARBIT_API_KEY`

We use Clearbit primarily to:
- Verify company names
- Get accurate company domains
- Obtain additional company metadata (industry, size, etc.)

## Setting Up People Data Labs

[People Data Labs](https://www.peopledatalabs.com/) (PDL) is a B2B data provider that helps find relevant contacts at companies.

1. Sign up for a PDL account at https://www.peopledatalabs.com/
2. Navigate to your dashboard and obtain your API key
3. Add the API key to your `.env.local` file as `PDL_API_KEY`

We use PDL to:
- Find recruiters and relevant employees at target companies
- Get contact details like email and LinkedIn profile URLs
- Filter contacts by relevance to the job being applied for

## API Usage and Costs

Both Clearbit and PDL operate on credit-based systems:

- **Clearbit**: Typically charges per API call, with costs varying by endpoint. The Company API costs around $0.10-0.25 per lookup.
- **PDL**: Charges per person lookup, typically $0.05-0.10 per person returned in search results.

For a production application, you should:

1. Implement aggressive caching to reduce API calls
2. Set up usage alerts to monitor costs
3. Consider implementing rate limiting to prevent abuse

## Database Caching

The implementation includes a caching mechanism that stores contacts in the Supabase `referral_contacts` table. This significantly reduces API costs and improves performance.

When a user searches for contacts at a company:
1. We first check if we have cached contacts for that company
2. If enough relevant contacts exist in the cache, we return those
3. If not, we make API calls and store the results for future use

## Rate Limiting Considerations

For production use, consider implementing additional rate limiting:

1. Limit the number of API calls per user per day
2. Implement exponential backoff for retries
3. Use a job queue for processing contact lookups asynchronously during high load

## Alternative APIs

If Clearbit or PDL don't meet your needs, consider these alternatives:

- [Hunter.io](https://hunter.io/) - Email finder service
- [Apollo.io](https://www.apollo.io/) - Sales intelligence platform
- [Lusha](https://www.lusha.com/) - Contact lookup service
- [ZoomInfo](https://www.zoominfo.com/) - B2B database (enterprise-focused)

## Legal and Ethical Considerations

When using contact data APIs, be aware of:

1. **Terms of Service**: Each provider has specific usage terms
2. **GDPR/CCPA Compliance**: Ensure your use of contact data complies with privacy regulations
3. **Rate Limits**: Respect the rate limits of each API provider
4. **Data Accuracy**: Always provide disclaimers about data accuracy

## Error Handling

The implementation includes robust error handling:

1. Graceful degradation to cached data when APIs fail
2. Fallback to mock data generation when no cache exists
3. Clear error messages to users when lookups fail
4. Extensive logging for debugging API issues

## Support and Troubleshooting

If you encounter issues with the contact APIs:

1. Check API provider status pages
2. Verify your API keys are correct and have sufficient credits
3. Monitor your API usage in the provider dashboards
4. Review the application logs for detailed error messages 