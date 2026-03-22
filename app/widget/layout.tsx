export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="widget-root"
      style={{
        background: 'transparent',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
