export const McpConfigBuilder = () => {
  const [pub, setPub] = React.useState("");
  const [priv, setPriv] = React.useState("");
  const [client, setClient] = React.useState("cursor");
  const [os, setOs] = React.useState("mac");
  const [copied, setCopied] = React.useState(false);

  const pk = pub.trim();
  const sk = priv.trim();
  const filled = pk !== "" && sk !== "";

  const smitheryConfig = (publicKey, privateKey) =>
    JSON.stringify({
      FUTUUR_PUBLIC_KEY: publicKey,
      FUTUUR_PRIVATE_KEY: privateKey,
    });

  const quoteEnv = (value) =>
    value && /[\s"'\\=&|^<>]/.test(value)
      ? `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
      : value;

  const smitheryInstall = (smitheryClient, publicKey, privateKey, platform) => {
    const cfg = smitheryConfig(publicKey, privateKey);
    if (platform === "win") {
      const escaped = cfg.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `npx -y @smithery/cli install @futuur/futuur-mcp --client ${smitheryClient} --config "${escaped}"`;
    }
    return `npx -y @smithery/cli install @futuur/futuur-mcp --client ${smitheryClient} --config '${cfg.replace(/'/g, "'\\''")}'`;
  };

  const claudeCodeCmd = (publicKey, privateKey) =>
    `claude mcp add futuur -- npx -y @futuur/futuur-mcp -e FUTUUR_PUBLIC_KEY=${quoteEnv(publicKey)} -e FUTUUR_PRIVATE_KEY=${quoteEnv(privateKey)}`;

  const platform = os === "win" ? "win" : "unix";

  const commands = {
    cursor: {
      unix: smitheryInstall("cursor", pk, sk, "unix"),
      win: smitheryInstall("cursor", pk, sk, "win"),
    },
    claude: {
      unix: smitheryInstall("claude", pk, sk, "unix"),
      win: smitheryInstall("claude", pk, sk, "win"),
    },
    "claude-code": {
      unix: claudeCodeCmd(pk, sk),
      win: claudeCodeCmd(pk, sk),
    },
  };

  const command = commands[client][platform];

  const clients = [
    { id: "cursor", label: "Cursor" },
    { id: "claude", label: "Claude Desktop" },
    { id: "claude-code", label: "Claude Code" },
  ];

  const platforms = [
    { id: "mac", label: "macOS" },
    { id: "linux", label: "Linux" },
    { id: "win", label: "Windows" },
  ];

  const copy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderIcon = (name, active) => {
    const color = active ? "#ffffff" : "#d4d4d8";
    const svgProps = {
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: name === "claude-code" ? "none" : color,
      stroke: name === "claude-code" ? color : "none",
      strokeWidth: name === "claude-code" ? 2 : 0,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { flexShrink: 0 },
      "aria-hidden": true,
    };

    if (name === "cursor") {
      return (
        <svg {...svgProps}>
          <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
        </svg>
      );
    }
    if (name === "claude") {
      return (
        <svg {...svgProps}>
          <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
        </svg>
      );
    }
    if (name === "claude-code") {
      return (
        <svg {...svgProps}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" x2="20" y1="19" y2="19" />
        </svg>
      );
    }
    if (name === "mac") {
      return (
        <svg {...svgProps}>
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
      );
    }
    if (name === "linux") {
      return (
        <svg {...svgProps}>
          <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 0 0-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z" />
        </svg>
      );
    }
    if (name === "win") {
      return (
        <svg {...svgProps}>
          <path d="M0 3.449 9.75 2.1v9.451H0zm10.949-1.402 12.051-1.8v11.251H10.949zM0 12.6h9.75v9.451L0 20.699zm10.949 1.402h12.051V24L10.949 22.349z" />
        </svg>
      );
    }
    return null;
  };

  const choiceBtnStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
    borderRadius: "8px",
    border: active ? "1px solid #3b82f6" : "1px solid #52525b",
    background: active ? "#2563eb" : "#27272a",
    color: active ? "#ffffff" : "#f4f4f5",
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  });

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#fafafa",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #52525b",
    background: "#27272a",
    color: "#fafafa",
    fontFamily: "ui-monospace, monospace",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
  };

  const sectionLabelStyle = {
    marginBottom: "8px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#a1a1aa",
  };

  const hintStyle = {
    marginBottom: "12px",
    fontSize: "12px",
    color: "#a1a1aa",
    lineHeight: 1.5,
  };

  const footerStyle = {
    marginTop: "12px",
    marginBottom: 0,
    fontSize: "12px",
    color: "#a1a1aa",
    lineHeight: 1.5,
  };

  return (
    <div
      className="not-prose"
      style={{
        position: "relative",
        margin: "24px 0",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #3f3f46",
        background: "#18181b",
      }}
    >
      <style>{`
        #futuur-mcp-public-key::placeholder,
        #futuur-mcp-private-key::placeholder { color: #71717a; opacity: 1; }
      `}</style>
      <input
        type="text"
        name="email"
        autoComplete="email"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        defaultValue=""
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label htmlFor="futuur-mcp-public-key" style={labelStyle}>
            Public key
          </label>
          <input
            id="futuur-mcp-public-key"
            name="futuur-mcp-public-key"
            style={inputStyle}
            value={pub}
            onChange={(e) => setPub(e.target.value)}
            placeholder="paste your public key"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
          />
        </div>
        <div>
          <label htmlFor="futuur-mcp-private-key" style={labelStyle}>
            Private key
          </label>
          <input
            id="futuur-mcp-private-key"
            name="futuur-mcp-private-key"
            style={inputStyle}
            type="password"
            value={priv}
            onChange={(e) => setPriv(e.target.value)}
            placeholder="paste your private key"
            spellCheck={false}
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
          />
        </div>
      </div>

      <p style={sectionLabelStyle}>AI client</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {clients.map((c) => {
          const active = client === c.id;
          return (
            <button key={c.id} type="button" style={choiceBtnStyle(active)} onClick={() => setClient(c.id)}>
              {renderIcon(c.id, active)}
              {c.label}
            </button>
          );
        })}
      </div>

      <p style={sectionLabelStyle}>Operating system</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {platforms.map((p) => {
          const active = os === p.id;
          return (
            <button key={p.id} type="button" style={choiceBtnStyle(active)} onClick={() => setOs(p.id)}>
              {renderIcon(p.id, active)}
              {p.label}
              {p.id === "win" ? <span style={{ fontWeight: 400, opacity: 0.85 }}>(CMD)</span> : null}
            </button>
          );
        })}
      </div>

      {!filled && (
        <p style={hintStyle}>
          Paste both keys above to generate a command with your credentials. Empty keys stay empty in the template until you fill them in.
        </p>
      )}

      <div
        style={{
          position: "relative",
          overflow: "auto",
          borderRadius: "8px",
          background: "#09090b",
          padding: "16px 88px 16px 16px",
          opacity: filled ? 1 : 0.85,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "ui-monospace, monospace",
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#e4e4e7",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {command}
        </pre>
        <button
          type="button"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "6px",
            border: "none",
            background: "#52525b",
            color: "#fafafa",
            cursor: "pointer",
          }}
          onClick={copy}
        >
          {copied ? "Copied" : "Copy command"}
        </button>
      </div>

      <p style={footerStyle}>
        {client === "claude-code"
          ? "Run this in any terminal where the Claude Code CLI is installed."
          : "Run this once in a terminal — Smithery writes your config automatically."}{" "}
        Your keys never leave this page except in the command you copy.
      </p>
    </div>
  );
};
