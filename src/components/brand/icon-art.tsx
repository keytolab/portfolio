// Shared artwork for the generated tab icon and Apple touch icon:
// an ice-white "k" (for keyz) on the hero's blue-to-black glow.
export function IconArt({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background: "radial-gradient(circle at 38% 62%, #3f66c2 0%, #1a3a8f 40%, #000000 100%)",
        color: "#f2f3f5",
        fontSize: Math.round(size * 0.62),
        fontWeight: 600,
        letterSpacing: -1,
        lineHeight: 1,
        paddingBottom: Math.round(size * 0.04),
      }}
    >
      k
    </div>
  );
}
