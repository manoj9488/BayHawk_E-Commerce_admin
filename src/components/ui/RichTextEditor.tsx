import { useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link,
  Underline
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  className = "",
  minHeight = "120px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const formatText = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    try {
      // Use execCommand for basic formatting (still works in most browsers)
      document.execCommand(command, false, value);
      handleContentChange();
    } catch (error) {
      console.warn('Formatting command failed:', command, error);
    }
  }, [handleContentChange]);

  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert('Please select some text first');
      return;
    }
    
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  }, [formatText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        default:
          break;
      }
    }
  }, [formatText]);

  const toolbarButtons = [
    {
      group: 'format',
      buttons: [
        { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
      ]
    },
    {
      group: 'list',
      buttons: [
        { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
      ]
    },
    {
      group: 'align',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
        { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
        { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
        { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
      ]
    },
    {
      group: 'insert',
      buttons: [
        { icon: Link, command: 'link', title: 'Insert Link', onClick: insertLink },
        { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
      ]
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap gap-1">
        {/* Text Format Dropdown */}
        <select
          onChange={(e) => formatText('formatBlock', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm mr-2"
          defaultValue=""
        >
          <option value="">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        {/* Toolbar Button Groups */}
        {toolbarButtons.map((group, groupIndex) => (
          <div key={group.group} className="flex gap-1">
            {groupIndex > 0 && <div className="w-px bg-gray-300 mx-1" />}
            {group.buttons.map((button) => {
              const Icon = button.icon;
              const hasOnClick = 'onClick' in button;
              const hasValue = 'value' in button;
              return (
                <button
                  key={button.command}
                  type="button"
                  onClick={hasOnClick ? button.onClick : () => formatText(button.command, hasValue ? button.value : undefined)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={button.title}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rich-text-editor"
        style={{ 
          minHeight,
          lineHeight: '1.5'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        role="textbox"
        aria-label="Rich text editor"
      />
    </div>
  );
}