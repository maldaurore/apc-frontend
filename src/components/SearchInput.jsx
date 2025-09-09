import { useEffect, useRef, useState } from "react";
import usePacientes from "../hooks/usePacientes";
export default function ClientSearchInput({
  onSelect,
  placeholder = "Busca un paciente…",
  minChars = 2,
}) {
  const { pacientes } = usePacientes();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const boxRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.trim().length < minChars) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      setHighlight(-1);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(() => {
      const t = query.trim().toLowerCase();
      const filtered = pacientes
        .filter(
          (p) =>
            p.nombre.toLowerCase().includes(t) ||
            (p.correo && p.correo.toLowerCase().includes(t))
        )
        .slice(0, 10);
      setResults(filtered);
      setOpen(true);
      setLoading(false);
      setHighlight(-1);
    }, 250);

    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [query, minChars, pacientes]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (opt) => {
    onSelect(opt);
    setQuery(opt.nombre);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === "ArrowDown" && results.length > 0) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = highlight >= 0 ? highlight : 0;
      handleSelect(results[idx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="pacientes-options"
        aria-activedescendant={highlight >= 0 ? `opt-${highlight}` : undefined}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
      />

      {loading && (
        <div className="absolute right-3 top-2.5 text-xs text-gray-500">
          Buscando…
        </div>
      )}

      {open && (
        <ul
          id="pacientes-options"
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {results.length === 0 && !loading ? (
            <li className="px-3 py-2 text-sm text-gray-500">Sin resultados</li>
          ) : (
            results.map((c, i) => (
              <li
                id={`opt-${i}`}
                key={c.id}
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(c)}
                className={`cursor-pointer px-3 py-2 transition ${
                  i === highlight ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{c.nombre}</span>
                  {c.email && (
                    <span className="text-xs text-gray-500">{c.email}</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
