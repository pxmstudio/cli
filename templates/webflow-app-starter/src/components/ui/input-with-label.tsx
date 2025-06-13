import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

type InputWithLabelProps = React.ComponentProps<typeof Input> & {
  label: string;
  id: string;
  type?: string;
  className?: string;
  helpText?: string;
};

export default function InputWithLabel({
  label,
  type = "text",
  id,
  helpText,
  className,
  ...props
}: InputWithLabelProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
        </Label>
      )}

      <Input type={type} id={id} {...props} />
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}
