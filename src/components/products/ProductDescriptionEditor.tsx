import { Card } from '../ui';
import { SimpleRichTextEditor } from '../ui/SimpleRichTextEditor';

interface ProductDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductDescriptionEditor({ value, onChange }: ProductDescriptionEditorProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Description</h2>
      </div>

      <SimpleRichTextEditor
        value={value}
        onChange={onChange}
        placeholder="Enter product description"
        minHeight="120px"
      />
    </Card>
  );
}