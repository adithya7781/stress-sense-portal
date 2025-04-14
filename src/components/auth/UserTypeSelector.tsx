
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface UserTypeSelectorProps {
  form: UseFormReturn<any>;
}

const UserTypeSelector = ({ form }: UserTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="userType"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>User Type</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="it_professional" id="it_professional" />
                <Label htmlFor="it_professional">IT Professional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin (HR)</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserTypeSelector;
