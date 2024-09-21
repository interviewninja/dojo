"use client"

import React, { useEffect, useState } from "react";
import Editor, { loader } from '@monaco-editor/react';
import { useTheme } from "next-themes";
import 'src/app/globals.css';

type CodeEditorProps = {
  onChange: (value: string) => void;
  language?: string;
  code?: string;
  path?: string;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, language, code, path }) => {
  const { theme } = useTheme()
  const [value, setValue] = useState(code || "");
  const [updated, setUpdated] = useState(false);

  const handleEditorChange = (value: any) => {
    setValue(value);
    onChange(value);
  };

  interface CustomTheme {
    base: any;
    color: string;
    mode: string;
  }

  const customLightTheme: CustomTheme = {
    base: "vs", 
    color: "#FFFFFF", 
    mode: "light"
  }

  const customDarkTheme: CustomTheme = {
    base: "vs-dark",
    color: "#021304",
    mode: "dark"
  }

  const customThemes = { customLightTheme, customDarkTheme }

  const findThemeByMode = (mode: any) => Object.values(customThemes).find(theme => theme.mode === mode);

  useEffect(() => {
    loader.init().then((monaco) => {
      const matchedTheme = findThemeByMode(theme);
      if (matchedTheme) {
        monaco.editor.defineTheme('currentTheme', {
          base: matchedTheme.base,
          inherit: true,
          rules: [
            // { token: "comment", foreground: "#000000", background: "#000000" }, //.this()
            // { token: "keyword", foreground: "#000000", background: "#000000" }, //function
            // { token: "string", foreground: "#000000", background: "#000000" }, //string
            // { token: "number", foreground: "#000000", background: "#000000" }, //8
            // { token: "identifier", foreground: "#000000", background: "#000000" }, //+=
          ],
          colors: {
            'editor.background': matchedTheme.color,
          },
        });
      }
    });
  }, [theme]);

  return (
    <div className='w-full h-full'>
      <Editor
        height={`100%`}
        width={`100%`}
        language={language}
        value={code}
        theme={'currentTheme'}
        defaultValue="// Click the play icon to begin."
        onChange={handleEditorChange}
      />
    </div>
  );
}; 
    