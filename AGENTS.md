<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep unavailable-service read fixtures in `src/lib/demo-data.ts` behind the shared API client so existing public query shapes and live-data precedence remain consistent.
- Sample dashboard access is explicit and read-only; never send the preview marker to the external API or fabricate successful writes or real authentication.
