export interface DocOfFile<TFile> {
  introduction: string;
  content: DocOfAssertionsFile<TFile>;
}

export type DocOfAssertionsFile<TFile> = {
  [TKey in keyof TFile]: AssertionDocEntry;
};

export interface AssertionDocEntry {
  description: string;
  example: string;
}
