
import { Layout, theme } from 'antd'
import { forwardRef, memo } from 'react'

const { Content } = Layout

type Props = {
    children: React.ReactNode,
}

const BaseLayout = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
    const { token } = theme.useToken()
    return (
        <Layout
            ref={ref}
            style={{
                minHeight: '100vh',
                background: token.colorBgBase,
                padding: '24px 0',
            }}
        >
            <Content
                style={{
                    maxWidth: 1920,
                    margin: '0 auto',
                    padding: '0 16px',
                    width: '100%',
                }}
            >
                {children}
            </Content>
        </Layout>
    )
})

export default memo(BaseLayout)