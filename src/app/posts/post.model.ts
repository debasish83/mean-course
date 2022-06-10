// we are using {title: String, content: String} at multiple places. It's better to abstract a model and then
// use it in multiple places
export interface Post {
  id: String;
  title: String;
  content: String;
  imagePath: String;
}
