import remarkBreaks from 'remark-breaks'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/router';

export default function Markdown({ className = '', children }: { className?: string, children:string }) {

    const router = useRouter()
    function rewriteRedirect(url: string) {
        return `/linkRedirect?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(router.asPath)}&integrity=${encodeURIComponent(Buffer.from(url).toString('base64'))}`
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkBreaks, remarkGfm]}
            linkTarget={'_blank'}
            className={className}

            transformLinkUri={((uri) => {
                return rewriteRedirect(uri)
            })}
        >
            {children}
        </ReactMarkdown>
    )
}