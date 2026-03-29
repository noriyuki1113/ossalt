import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FieldProps {
  label: string;
  required?: boolean;
  children?: React.ReactNode;
}

function FieldWrapper({ label, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}

export function AdminTextField({ label, value, onChange, required, placeholder, type = "text" }: TextFieldProps) {
  return (
    <FieldWrapper label={label} required={required}>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </FieldWrapper>
  );
}

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function AdminTextareaField({ label, value, onChange, rows = 3, placeholder }: TextareaFieldProps) {
  return (
    <FieldWrapper label={label}>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </FieldWrapper>
  );
}

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AdminSwitchField({ label, checked, onChange }: SwitchFieldProps) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Switch checked={checked} onCheckedChange={onChange} />
      <Label className="text-sm cursor-pointer">{label}</Label>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function AdminSelectField({ label, value, onChange, options, required }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} required={required}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

export function AdminNumberField({ label, value, onChange, required }: { label: string; value: number; onChange: (v: number) => void; required?: boolean }) {
  return (
    <FieldWrapper label={label} required={required}>
      <Input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} />
    </FieldWrapper>
  );
}
